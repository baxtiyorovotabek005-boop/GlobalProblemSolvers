import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const problems = [
  { id: 'climate-change', emoji: '🌡️', name: 'Climate Change', desc: 'Rising temperatures, extreme weather, and melting ice caps threaten our planet.' },
  { id: 'global-hunger', emoji: '🌾', name: 'Global Hunger', desc: 'Over 800 million people suffer from chronic undernourishment.' },
  { id: 'education', emoji: '📚', name: 'Access to Education', desc: 'Millions of children lack access to quality education worldwide.' },
  { id: 'water-scarcity', emoji: '💧', name: 'Water Scarcity', desc: '2.2 billion people lack access to safely managed drinking water.' },
  { id: 'air-pollution', emoji: '🏭', name: 'Air Pollution', desc: 'Air pollution causes 7 million deaths annually.' },
  { id: 'deforestation', emoji: '🌲', name: 'Deforestation', desc: 'We lose 27 football fields of forest every minute.' },
]

function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: scrolled ? '12px 60px' : '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2000,
        background: scrolled ? 'rgba(2, 12, 27, 0.95)' : 'rgba(2, 12, 27, 0.75)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div className="logo-container">
          <i className="fas fa-globe-americas earth-logo"></i>
          <span className="main-title">Global<span className="red-letter">Problem</span>Solvers</span>
        </div>

        <ul className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : 'flex' }}>
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><a href="#problems" onClick={() => setMobileMenuOpen(false)}>Problems</a></li>
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/community" className="nav-login-btn">
            <i className="fas fa-sign-in-alt"></i> Join Hub
          </Link>
          <button 
            className="hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <header style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', textAlign: 'center' }}>
        <div className="hero-overlay"></div>
        <h1 id="typed-hero" style={{ position: 'relative', zIndex: 10, fontSize: 'clamp(2rem, 8vw, 4rem)', fontFamily: "'Poppins', sans-serif", minHeight: '120px', marginBottom: '40px', color: 'white' }}>
          Solve Global <span style={{ color: '#64ffda' }}>Problems</span><br />Together
        </h1>
        <Link to="/community" className="cta-btn" style={{ position: 'relative', zIndex: 10 }}>
          Join the Discussion
        </Link>
      </header>

      <section id="problems" className="section about-bg">
        <h2 className="section-title">Global Challenges</h2>
        <div className="problem-grid">
          {problems.map((p) => (
            <div key={p.id} className="problem-card">
              <div style={{ height: '250px', background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '4rem' }}>{p.emoji}</span>
              </div>
              <div className="card-content">
                <h3>{p.name}</h3>
                <p style={{ color: '#8892b0' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <h2 className="section-title">About Us</h2>
        <div className="about-flex">
          <div style={{ flexShrink: 0 }}>
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop" 
              alt="About" 
              className="img-profile" 
            />
          </div>
          <div className="about-card">
            <h3>Our Mission</h3>
            <p style={{ marginBottom: '16px' }}>
              GlobalProblemSolvers is a community-driven platform where people from around the world come together to brainstorm solutions to the most pressing challenges facing humanity. From climate change to global hunger, we believe that collective intelligence can create meaningful change.
            </p>
            <p>
              Join our live discussions, share your ideas, and connect with like-minded individuals who are passionate about making a difference.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="section about-bg">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-card">
          <p>Have a question or want to collaborate? We'd love to hear from you!</p>
          <a href="mailto:shahriyor02122012@gmail.com">
            <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i> shahriyor02122012@gmail.com
          </a>
          <a href="https://t.me/Shahriyor0212" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram" style={{ marginRight: '8px' }}></i> @Shahriyor0212
          </a>
        </div>
      </section>

      <footer>
        <p>© 2024 GlobalProblemSolvers. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Landing