import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Availability from './pages/Availability'
import CreateEvent from './pages/CreateEvent'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </Router>
  )
}

export default App
