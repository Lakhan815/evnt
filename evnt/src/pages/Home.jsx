import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-void-container">
      
      <div className="main-app-box">

        <section className="hero">
          <div className="badge">Made for Rutgers Blueprint :)</div>
          
          <h2>Make moments happen... for real</h2>

          <h1 className="hero-title">
            Plan an <span className="gradient-text">evnt</span>
          </h1>
          
          <p className="hero-subtitle">
            "Let's do something sometime" never ends up happening. <br/><br />
            Plan out real events, with real availability, and <b>real results</b>.
          </p>

          <div className="button-group">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
          </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Sign In
          </button>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <h3>Check Your Availability</h3>
            <p>Connect your Google Calendar to visualize your free time through the Google Calendar API.</p>
          </div>
          <div className="feature-card">
            <h3>Discover Events</h3>
            <p>Browse nearby concerts and games you'll actually like using the Ticketmaster API.</p>
          </div>
          <div className="feature-card">
            <h3>Instant Invite</h3>
            <p>Share the event link to your friends, and make the evnt really happen.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;