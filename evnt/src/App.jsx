import { useState } from 'react'
import johnImg from './assets/JohnSmith.png' //the johnsmith png that was imported
import calenderIcon from './assets/CalenderIcon.png'
import friendIcon from './assets/FriendIcon.png'
import './App.css'

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => { //essentially just checks if the username and password are correct)
    if (username === "John12" && password === "Smith12") {
      setLoggedIn(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }
  const handleClick = () => {
  console.log("clicked")
}

  if (loggedIn) { //currently under construction
    return (//container shall hold 4 containers within, it is the 4 boxes in the figma
      <div className="container">
          <section className="welcomeCard">
            <img src={johnImg} alt="John Smith" className="profileImg"/>
            <h1>Good Afternoon, {username}!</h1>
          </section>
          <section className="loggedInTitle">EVNT</section> 
          <section className="sideButtons">
            <label>Friend</label>
            <button onClick={handleClick} className="friendButton">
              <img src={friendIcon} alt="Friendssss" />
            </button>
            <label>Calender:</label>
            <button onClick={handleClick} className="calenderButton">
              <img src={calenderIcon} alt="Calenderssss"/>
            </button>
          </section>
      </div>
    )
  }

  return ( //the first loggin screen. not much to it than that
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
