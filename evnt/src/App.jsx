import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
//import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (username === "John12" && password === "Smith12") {
      setLoggedIn(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  if (loggedIn) {
    return (
      <div className="container">
          <section className="Welcome Screen">
            <h1>Good Afternoon, {username}!</h1>
          </section>
      </div>
    )
  }

  return (
    <>
      <section className="loginSection">
        <h1 className="title">EVNT</h1>
        <section className="loginCard">
          <h2>Login</h2>
          <p1>Sign Into Your Account</p1>
          <label>Username:</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="TonyDoctor2000"/>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="APasWrd"/>
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>
      </section>
    </>
  )
}

export default App
