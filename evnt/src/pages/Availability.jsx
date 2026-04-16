import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Availability.css'

function Availability() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [slotDuration, setSlotDuration] = useState(30)
  const [selectedSlots, setSelectedSlots] = useState([])

  // mysite.com/availability#access_token=123...
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      const expiresIn = params.get('expires_in')
      if (token) {
        localStorage.setItem('googleAccessToken', token)
        localStorage.setItem('googleTokenExpiry', Date.now() + expiresIn * 1000)
        window.history.replaceState({}, document.title, window.location.pathname)
        setIsLoggedIn(true)
        setUserName('Google Calendar User')
        fetchFreeBusy(token)
      }
    }
  }, [])

  useEffect(() => {
    const savedToken = localStorage.getItem('googleAccessToken')
    const tokenExpiry = localStorage.getItem('googleTokenExpiry')
    if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      setIsLoggedIn(true)
      setUserName('Google Calendar User')
      fetchFreeBusy(savedToken)
    }
  }, [])

  // sends user to Google login
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = window.location.origin + '/availability'
    const scope = 'https://www.googleapis.com/auth/calendar.readonly'
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`
    window.location.href = authUrl
  }

  const handleGoogleLogout = () => {
    setIsLoggedIn(false); setUserName(''); setAvailableDates([]); setSelectedDate(null); setTimeSlots([]); setSelectedSlots([]);
    localStorage.removeItem('googleAccessToken'); localStorage.removeItem('googleTokenExpiry');
  }

  useEffect(() => {
    if (selectedDate && availableDates.length > 0) {
      const dateData = availableDates.find(d => d.dateStr === selectedDate)
      if (dateData) setTimeSlots(generateTimeSlots(dateData, slotDuration))
    }
  }, [slotDuration, selectedDate])

  const fetchFreeBusy = async (token) => {
    setLoading(true)
    try {
      const now = new Date(); const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeMin: now.toISOString(), timeMax: endDate.toISOString(), items: [{ id: 'primary' }] }),
      })
      if (response.ok) {
        const data = await response.json()
        setAvailableDates(extractAvailableDates(data.calendars.primary.busy || [], now, endDate))
      }
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  const extractAvailableDates = (busyTimes, startDate, endDate) => {
    const dates = []; let curr = new Date(startDate)
    while (curr < endDate) {
      const dStr = curr.toISOString().split('T')[0]
      dates.push({ date: new Date(curr), dateStr: dStr, busyTimes: busyTimes.filter(s => s.start.startsWith(dStr)) })
      curr.setDate(curr.getDate() + 1)
    }
    return dates
  }

  const generateTimeSlots = (dateData, duration) => {
    const slots = []; let curr = new Date(`${dateData.dateStr}T09:00:00`)
    const end = new Date(`${dateData.dateStr}T22:00:00`)
    const busy = dateData.busyTimes.map(s => ({ start: new Date(s.start), end: new Date(s.end) }))
    while (curr < end) {
      const sEnd = new Date(curr.getTime() + duration * 60000)
      const isFree = !busy.some(b => !(sEnd <= b.start || curr >= b.end))
      slots.push({ start: new Date(curr), end: sEnd, isFree }); curr = sEnd
    }
    return slots
  }

  const isDateFree = (dateData) => {
    const slots = generateTimeSlots(dateData, slotDuration)
    return slots.filter(s => s.isFree).length >= 5
  }

  const toggleSlotSelection = (slot) => {
    const id = `${selectedDate}-${slot.start.getTime()}`
    const exists = selectedSlots.some(s => s.id === id)
    if (exists) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== id))
    } else {
      setSelectedSlots([...selectedSlots, { ...slot, dateStr: selectedDate, id }])
    }
  }

  if (!isLoggedIn) return (
    <div className="eventsContainer">
      <h1 className="gradient-text">evnt</h1>
      <p>Connect your calendar to get started.</p>
      <button className="googleLoginBtn" onClick={handleGoogleLogin}>📅 Login with Google</button>
    </div>
  )

  return (
    <div className="eventsContainer">
      <div className="header">
        <div className="controls">
          <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))}>
            <option value={30}>30 mins</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={180}>3 hours</option>
          </select>
          <button className="logoutBtn" onClick={handleGoogleLogout}>Logout</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : !selectedDate ? (
        <div className="datesGrid">
          {availableDates.map(d => (
            <button 
              key={d.dateStr} 
              className={`dateButton ${isDateFree(d) ? 'free' : 'busy'}`} 
              onClick={() => setSelectedDate(d.dateStr)}
            >
              {d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
              {selectedSlots.some(s => s.dateStr === d.dateStr) && <span className="dot"></span>}
            </button>
          ))}
          {selectedSlots.length > 0 && (
            <button className="floatingNextBtn" onClick={() => navigate('/create-event', { state: { slots: selectedSlots } })}>
              Next ({selectedSlots.length})
            </button>
          )}
        </div>
      ) : (
        <div className="timeSlotsView">
          <button className="backBtn" onClick={() => setSelectedDate(null)}>← Back to Dates</button>
          <h2>{new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
          <div className="slotsGrid">
            {timeSlots.map((s, i) => {
              const selected = selectedSlots.some(sel => sel.id === `${selectedDate}-${s.start.getTime()}`)
              return (
                <div key={i} className={`timeSlot ${s.isFree ? 'free' : 'busy'} ${selected ? 'selected' : ''}`} 
                     onClick={() => s.isFree && toggleSlotSelection(s)}>
                  {s.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <small>{selected ? '✓' : s.isFree ? 'Free' : 'Busy'}</small>
                </div>
              )
            })}
            {selectedSlots.length > 0 && (
              <button className="floatingNextBtn" onClick={() => navigate('/create-event', { state: { slots: selectedSlots } })}>
                Next ({selectedSlots.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Availability