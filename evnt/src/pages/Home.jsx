import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <section>
    <h1>Make moments happen. Plan an evnt.</h1>
    
    <button onClick={() => navigate('/login')}>
      Login
    </button>
    </section>
  )
}

export default Home
