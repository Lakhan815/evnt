import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = () => { //essentially just checks if the username and password are correct)
    if (username === "admin" && password === "admin") {
      setLoggedIn(true)
      setError("")
      navigate('/events')
    } else {
      setError("Invalid username or password")
    }
  }

  return ( //the first login screen. not much to it than that
    <>
      <section className="loginSection">
        <h1 className="title">EVNT</h1>
        <section className="loginCard">
          <h2>Login</h2>
          <p1>Sign Into Your Account</p1>
          <label>Username:</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>
      </section>
    </>
  )
}

export default Login
