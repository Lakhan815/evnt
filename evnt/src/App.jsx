import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
//import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className="loginSection">
        <h1 className="title">EVNT</h1>
        <section className="loginCard">
          <h2>Login</h2>
          <p1>Sign Into Your Account</p1>
          <label>Username:</label>
          <input type="text" placeholder="TonyDoctor2000"/>
          <label>Password:</label>
          <input type="password" placeholder="APasWrd"/>
          <button>Login</button>
        </section>
      </section>
    </>
  )
}

export default App
