import { useState, useEffect } from "react";
import "./Events.css";
const tmAPI = import.meta.env.VITE_TICKETMASTER_API_KEY;

function Events() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [slotDuration, setSlotDuration] = useState(30);

  // Check if we have an access token from OAuth redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (token) {
        localStorage.setItem("googleAccessToken", token);
        localStorage.setItem(
          "googleTokenExpiry",
          Date.now() + expiresIn * 1000,
        );

        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        // Set logged in and fetch calendar
        setIsLoggedIn(true);
        setUserName("Google Calendar User");
        fetchFreeBusy(token);
      }
    }
  }, []);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("googleAccessToken");
    const tokenExpiry = localStorage.getItem("googleTokenExpiry");

    if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      setIsLoggedIn(true);
      setUserName("Google Calendar User");
      fetchFreeBusy(savedToken);
    }
  }, []);

  //Ticketmaster search functionality
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("New York");

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!city.trim()) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          apikey: tmAPI,
          keyword,
          city: city.trim(),
          countryCode: "US",
          size: 49,
        });
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
        );
        const data = await res.json();
        setEvents(data._embedded?.events ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [keyword, city]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = window.location.origin + "/events";
    const scope = "https://www.googleapis.com/auth/calendar.readonly";
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  const handleGoogleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setAvailableDates([]);
    setSelectedDate(null);
    setTimeSlots([]);
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("googleTokenExpiry");
  };

  // Recalculate time slots when duration changes
  useEffect(() => {
    if (selectedDate && availableDates.length > 0) {
      const dateData = availableDates.find((d) => d.dateStr === selectedDate);
      if (dateData) {
        const slots = generateTimeSlots(dateData, slotDuration);
        setTimeSlots(slots);
      }
    }
  }, [slotDuration]);

  const fetchFreeBusy = async (token) => {
    console.log("Fetching free/busy data...");
    setLoading(true);
    try {
      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/freeBusy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timeMin: now.toISOString(),
            timeMax: endDate.toISOString(),
            items: [{ id: "primary" }],
          }),
        },
      );

      console.log("FreeBusy response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("FreeBusy data:", data);
        const busy = data.calendars.primary.busy || [];
        const dates = extractAvailableDates(busy, now, endDate);
        setAvailableDates(dates);
      } else {
        const errorData = await response.json();
        console.error("FreeBusy error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching free/busy:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractAvailableDates = (busyTimes, startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayBusyTimes = busyTimes.filter((slot) =>
        slot.start.startsWith(dateStr),
      );

      dates.push({
        date: new Date(currentDate),
        dateStr: dateStr,
        hasBusyTime: dayBusyTimes.length > 0,
        busyTimes: dayBusyTimes,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleDateClick = (dateData) => {
    setSelectedDate(dateData.dateStr);
    const slots = generateTimeSlots(dateData, slotDuration);
    setTimeSlots(slots);
  };

  const generateTimeSlots = (dateData, duration) => {
    const slots = [];
    const dayStart = new Date(`${dateData.dateStr}T00:00:00`);
    const dayEnd = new Date(`${dateData.dateStr}T23:59:59`);

    let currentTime = new Date(dayStart);
    currentTime.setHours(9, 0, 0, 0);

    const busyTimes = dateData.busyTimes.map((slot) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));

    while (currentTime < dayEnd && currentTime.getHours() < 18) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      const isFree = !busyTimes.some(
        (busy) => !(slotEnd <= busy.start || currentTime >= busy.end),
      );

      slots.push({
        start: new Date(currentTime),
        end: slotEnd,
        isFree: isFree,
      });

      currentTime = slotEnd;
    }

    return slots;
  };

  if (!isLoggedIn) {
    return (
      <div className="eventsContainer">
        <h1>EVNT</h1>
        <p>Connect your Google Calendar to see your availability</p>
        <button className="googleLoginBtn" onClick={handleGoogleLogin}>
          📅 Login with Google Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="eventsContainer">
      <div className="header">
        <h1>EVNT</h1>
        <div className="userInfo">
          <span>Logged in as: {userName}</span>
          <button className="logoutBtn" onClick={handleGoogleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="searchSection">
        <input
          placeholder="Search events..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          placeholder="City (e.g. New York)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {loading && <p>Loading...</p>}
        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p>{event.dates.start.localDate}</p>
              <p>{event._embedded?.venues?.[0]?.name}</p>
              <a href={event.url}>Buy Tickets</a>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading calendar data...</p>
      ) : availableDates.length === 0 ? (
        <p>No calendar data available</p>
      ) : (
        <>
          <div className="datesGrid">
            {availableDates.map((dateData) => (
              <button
                key={dateData.dateStr}
                className={`dateButton ${dateData.hasBusyTime ? "busy" : "free"} ${
                  selectedDate === dateData.dateStr ? "selected" : ""
                }`}
                onClick={() => handleDateClick(dateData)}
              >
                {dateData.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                <br />
                <small>
                  {dateData.hasBusyTime ? "Has events" : "Fully free"}
                </small>
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="timeSlotsContainer">
              <div className="slotsHeader">
                <h2>Time slots for {selectedDate}</h2>
                <div className="durationSelector">
                  <label htmlFor="duration">Slot duration:</label>
                  <select
                    id="duration"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>
              <div className="slotsGrid">
                {timeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`timeSlot ${slot.isFree ? "free" : "busy"}`}
                  >
                    {slot.start.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    -{" "}
                    {slot.end.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    <br />
                    <small>{slot.isFree ? "✓ Free" : "✗ Busy"}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Events;
