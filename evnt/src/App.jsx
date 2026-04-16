import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Availability from './pages/Availability'
import CreateEvent from './pages/CreateEvent'
import './App.css'
import ShareButton from "./ShareButton";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>My Event App</h1>

      <ShareButton />
    </div>
  );
}

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
