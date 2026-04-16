import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateEvent.css";
import { RWebShare } from "react-web-share-api";

const tmAPI = import.meta.env.VITE_TICKETMASTER_API_KEY;

function CreateEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const slots = state.slots || [];

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [error, setError] = useState("");

  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("New York");
  const [loading, setLoading] = useState(false);

  const slotDates = slots.map((slot) => slot.dateStr);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!city.trim()) return;
      setLoading(true);
      //pulls from the api and sets the events state to the results
      try {
        //builds the parameters for the api to search easier
        const params = new URLSearchParams({
          apikey: tmAPI,
          keyword,
          city: city.trim(),
          countryCode: "US",
          size: 20,
        });
        //syncs it to the date to the dates selected
        if (slotDates.length > 0) {
          params.append("startDateTime", `${slotDates[0]}T00:00:00Z`);
          params.append(
            "endDateTime",
            `${slotDates[slotDates.length - 1]}T23:59:59Z`,
          );
        }
        //actual get request to the api
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
        );
        const data = await res.json();
        setEvents(data._embedded?.events ?? []);
        //error handling
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [keyword, city, slots]);

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      setError("Event name is required");
      return;
    }
    setError("");
    console.log("Event created:", {
      name: eventName,
      description: eventDescription,
      options: slots,
    });
    alert(`Event "${eventName}" created with ${slots.length} time options!`);
    navigate("/availability");
  };

  const handleCancel = () => {
    navigate("/availability");
  };

  return (
    <div className="pageDisplay">
      <div className="createEventContainer">
        <div className="eventCard">
          <h1>Create Event</h1>

          <div className="timeInfo">
            {slots.map((slot, index) => (
              <div key={index} className="slotWrapper">
                <p className="dateTime">
                  <strong>{formatDate(slot.dateStr)}</strong>
                </p>
                <p className="timeRange">
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </p>
              </div>
            ))}
          </div>

          <div className="formGroup">
            <label htmlFor="eventName">Event Name:</label>
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="eventDescription">Description (optional):</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Enter event description"
              rows="4"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="buttonGroup">
            <button className="createBtn" onClick={handleCreateEvent}>
              Create Event
            </button>
            <button className="cancelBtn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/*Second panel showing all of the events for day selected */}
      <div className="createEventContainer">
        <div className="eventCard">
          <h1>Find Events Nearby</h1>
          <div className="formGroup">
            <input
              placeholder="Search events..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <input
              placeholder="City (e.g. New York)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          {loading && <p>Loading...</p>}
          <div className="event-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p>{formatDate(event.dates.start.localDate)}</p>
                <p>{event._embedded?.venues?.[0]?.name}</p>
                <a href={event.url} target="_blank" rel="noreferrer">
                  Buy Tickets
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

//*Just A Test Rn - No Domain means No Link*//
function App() {
  return (
    <div>
      <RWebShare
        data={{
          text: "Check out this event",
          title: "Event Share",
        }}
        onClick={() => console.log("shared event")}
      >
        <button>Share</button>
      </RWebShare>
    </div>
  );
}

export default CreateEvent;
