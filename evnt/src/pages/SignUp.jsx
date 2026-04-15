import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignUp.css'

function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    navigate('/availability')
  }

  return (
    <>
      <section className="loginSection">
        <h1 className="title">EVNT</h1>
        <section className="loginCard">
          <h2>Create Account</h2>
          <p1>Sign Up for EVNT</p1>

          <label>Username:</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>

          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"/>

          <button onClick={handleSignUp}>Create Account</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <p style={{ marginTop: '20px' }}>
            Already have an account? <a href="/login" style={{ color: '#6f4a8e', textDecoration: 'none', fontWeight: 'bold' }}>Login</a>
          </p>
        </section>
      </section>
    </>
  )
}

export default SignUp
