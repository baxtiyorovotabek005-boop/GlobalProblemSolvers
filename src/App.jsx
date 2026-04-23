import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Problems from './components/Problems'
import Achievements from './components/Achievements'
import Donation from './components/Donation'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import ProfileModal from './components/ProfileModal'
import AIEvaluator from './components/AIEvaluator'
import XPDisplay from './components/XPDisplay'
import Statistics from './pages/Statistics'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function Home() {
  const [aiSolution, setAiSolution] = useState(null)
  const { isLoggedIn } = useAuth()

  const handleSolutionSubmit = (solution) => {
    if (isLoggedIn) {
      setAiSolution(solution)
    }
  }

  const closeAI = () => setAiSolution(null)

  return (
    <main>
      <Hero />
      <Problems onEvaluate={handleSolutionSubmit} />
      <Achievements />
      <Donation />
      <Contact />
      
      {aiSolution && (
        <AIEvaluator solution={aiSolution} onClose={closeAI} />
      )}
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <XPDisplay />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
        <Footer />
        <LoginModal />
        <ProfileModal />
      </div>
    </AuthProvider>
  )
}

function CommunityPage() {
  return (
    <div className="section" style={{ minHeight: '60vh', paddingTop: '6rem' }}>
      <div className="container text-center">
        <h1>Community Hub</h1>
        <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>
          Coming soon with real-time chat...
        </p>
      </div>
    </div>
  )
}

export default App