import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CreateEvent.css'

function CreateEvent() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}

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
      date: state.date,
      startTime: formatTime(state.startTime),
      endTime: formatTime(state.endTime),
    })
    // Here you would normally save the event to your backend
    alert(`Event "${eventName}" created for ${formatDate(state.date)} from ${formatTime(state.startTime)} to ${formatTime(state.endTime)}`)
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
          <p className="dateTime">
            <strong>{formatDate(state.date)}</strong>
          </p>
          <p className="timeRange">
            {formatTime(state.startTime)} - {formatTime(state.endTime)}
          </p>
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

export default CreateEvent
