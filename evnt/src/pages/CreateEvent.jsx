import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CreateEvent.css'
import { RWebShare } from 'react-web-share-api'

function CreateEvent() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}
  const slots = state.slots || []

  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [error, setError] = useState('')

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      setError('Event name is required')
      return
    }
    setError('')
    console.log('Event created:', {
      name: eventName,
      description: eventDescription,
      options: slots,
    })
    
    alert(`Event "${eventName}" created with ${slots.length} time options!`)
    navigate('/availability')
  }

  const handleCancel = () => {
    navigate('/availability')
  }

  return (
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
  )
}

//*Just A Test Rn - No Domain means No Link*//
function App () {
  return (
    <div>
      <RWebShare
        data= {{
          text: "Check out this event",
          title: "Event Share"
        }}
        onClick={() => console.log("shared event")}
        >
          <button>Share</button>
      </RWebShare>
    </div>
  )
}
export default CreateEvent