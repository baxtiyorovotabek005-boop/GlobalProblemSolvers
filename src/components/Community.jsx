import React, { useState, useEffect, useRef } from 'react'

const TOPICS = [
  { id: 'climate-change', emoji: '🌡️', name: 'Climate Change' },
  { id: 'global-hunger', emoji: '🌾', name: 'Global Hunger' },
  { id: 'education', emoji: '📚', name: 'Access to Education' },
  { id: 'water-scarcity', emoji: '💧', name: 'Water Scarcity' },
  { id: 'air-pollution', emoji: '🏭', name: 'Air Pollution' },
  { id: 'deforestation', emoji: '🌲', name: 'Deforestation' },
  { id: 'ocean-plastic', emoji: '🌊', name: 'Ocean Plastic' },
  { id: 'healthcare', emoji: '🏥', name: 'Healthcare Access' },
  { id: 'corruption', emoji: '⚖️', name: 'Corruption' },
  { id: 'gender-inequality', emoji: '♀️', name: 'Gender Inequality' },
]

const SIMULATED_USERS = [
  { name: 'Alex Johnson', initials: 'AJ' },
  { name: 'Maria Garcia', initials: 'MG' },
  { name: 'Chen Wei', initials: 'CW' },
  { name: 'Sarah Smith', initials: 'SS' },
  { name: 'Ahmed Hassan', initials: 'AH' },
  { name: 'Emma Wilson', initials: 'EW' },
  { name: 'Otabek', initials: 'OT' },
  { name: 'Lisa Brown', initials: 'LB' },
]

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function Community() {
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chatStarted, setChatStarted] = useState(false)
  const [roomMessages, setRoomMessages] = useState({})
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const messagesEndRef = useRef(null)
  const chatBoxRef = useRef(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('gps_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setLoading(false)
    } else {
      const timer = setTimeout(() => {
        setLoading(false)
        setShowAuth(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (chatStarted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, chatStarted])

  useEffect(() => {
    if (currentRoom && user) {
      const interval = setInterval(() => {
        const numUsers = Math.floor(Math.random() * 8) + 3
        const shuffled = [...SIMULATED_USERS].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, numUsers)
        setOnlineUsers([user, ...selected])
      }, 3000)
      
      setOnlineUsers([user, ...SIMULATED_USERS.slice(0, 3)])
      
      return () => clearInterval(interval)
    }
  }, [currentRoom, user])

  const dismissLoading = () => {
    setLoading(false)
    if (!user) {
      setShowAuth(true)
    }
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
    setCaptchaError('')
  }

  const switchAuthTab = (mode) => {
    setAuthMode(mode)
    setCaptchaError('')
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    
    if (captchaInput.toUpperCase() !== captcha) {
      setCaptchaError('Please enter the correct CAPTCHA')
      refreshCaptcha()
      return
    }
    
    const email = document.getElementById('auth-email')?.value?.trim()
    const password = document.getElementById('auth-password')?.value
    const name = document.getElementById('auth-name')?.value?.trim()

    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    if (authMode === 'signup' && (!name || name.length < 2)) {
      alert('Please enter your display name (min 2 characters)')
      return
    }
    
    const btn = document.getElementById('auth-submit-btn')
    if (btn) {
      btn.disabled = true
      btn.innerHTML = '<i className="fas fa-spinner fa-spin"></i> Please wait…'
    }

    setTimeout(() => {
      const displayName = name || email.split('@')[0]
      const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      const newUser = { email, displayName, initials }
      setUser(newUser)
      localStorage.setItem('gps_user', JSON.stringify(newUser))
      setShowAuth(false)
      refreshCaptcha()
    }, 1500)
  }

  const signOut = () => {
    localStorage.removeItem('gps_user')
    setUser(null)
    setCurrentRoom(null)
    setMessages([])
    setChatStarted(false)
    setOnlineUsers([])
    setShowAuth(true)
  }

  const openRoom = (roomId, emoji) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    const room = TOPICS.find(t => t.id === roomId)
    setCurrentRoom({ ...room, emoji })
    
    if (!roomMessages[roomId]) {
      setRoomMessages(prev => ({
        ...prev,
        [roomId]: [
          { id: 1, author: 'System', text: `Welcome to ${room.name}! This is a global discussion.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false }
        ]
      }))
    }
    
    setMessages(roomMessages[roomId] || [])
    setChatStarted(true)
  }

  const goBack = () => {
    if (currentRoom) {
      setRoomMessages(prev => ({
        ...prev,
        [currentRoom.id]: messages
      }))
    }
    setCurrentRoom(null)
    setMessages([])
    setChatStarted(false)
  }

  const sendMessage = () => {
    if (!inputText.trim() || !user || !currentRoom) return
    
    const newMsg = {
      id: Date.now(),
      author: user.displayName,
      authorInitials: user.initials,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }
    
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setRoomMessages(prev => ({
      ...prev,
      [currentRoom.id]: updatedMessages
    }))
    setInputText('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div id="firebase-loading" style={{ display: 'flex' }}>
        <div className="fl-globe">
          <i className="fas fa-globe-americas"></i>
        </div>
        <div className="fl-text">Global<span>Problem</span>Solvers</div>
        <div className="fl-ring"></div>
        <div className="fl-sub">Community Hub</div>
        <button 
          onClick={dismissLoading}
          style={{ marginTop: '18px', background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.35)', color: '#64ffda', padding: '10px 30px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter,sans-serif', letterSpacing: '1px' }}
        >
          Press to Enter &nbsp;→
        </button>
      </div>
    )
  }

  if (showAuth) {
    return (
      <div id="auth-overlay">
        <div className="auth-box">
          <div className="auth-globe">
            <i className="fas fa-globe-americas"></i>
          </div>
          <h2>Enter the <span>Hub</span></h2>
          <p className="auth-sub">Sign in or create an account to join the live discussion.</p>

          <div className="auth-tabs">
            <button className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => switchAuthTab('login')}>Sign In</button>
            <button className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => switchAuthTab('signup')}>Create Account</button>
          </div>

          <form onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <div className="auth-field">
                <i className="fas fa-user"></i>
                <input type="text" className="auth-input" id="auth-name" placeholder="Your display name" maxLength="30" />
              </div>
            )}

            <div className="auth-field">
              <i className="fas fa-envelope"></i>
              <input type="email" className="auth-input" id="auth-email" placeholder="Email address" />
            </div>

            <div className="auth-field">
              <i className="fas fa-lock"></i>
              <input type="password" className="auth-input" id="auth-password" placeholder="Password (min 6 characters)" />
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #1a3a5f, #0d2040)', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  letterSpacing: '8px',
                  color: '#64ffda',
                  userSelect: 'none'
                }}>
                  {captcha}
                </div>
                <button 
                  type="button"
                  onClick={refreshCaptcha}
                  style={{ 
                    background: 'rgba(100,255,218,0.1)', 
                    border: '1px solid rgba(100,255,218,0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#64ffda',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-redo"></i>
                </button>
              </div>
              <input 
                type="text" 
                className="auth-input" 
                id="auth-captcha" 
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                style={{ paddingLeft: '16px' }}
              />
              {captchaError && (
                <div className="auth-error show" style={{ display: 'block', marginTop: '8px' }}>
                  {captchaError}
                </div>
              )}
            </div>

            <button type="submit" className="auth-btn" id="auth-submit-btn">
              <i className="fas fa-arrow-right"></i> <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>

            {authMode === 'login' && (
              <button type="button" className="forgot-link">Forgot password?</button>
            )}
          </form>
        </div>
      </div>
    )
  }

  if (currentRoom) {
    return (
      <div id="hub-page" style={{ display: 'block', minHeight: '100vh' }}>
        <div className="chat-topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={goBack}>
              <i className="fas fa-arrow-left"></i> Rooms
            </button>
            <div className="chat-topic-badge">
              <span className="chat-topic-emoji">{currentRoom.emoji}</span>
              <span className="chat-topic-name">{currentRoom.name}</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="online-badge">
              <span className="live-dot"></span>
              <span>{onlineUsers.length}</span> online
            </div>
            <div className="user-me-badge">
              <div className="user-me-avatar">{user?.initials}</div>
              <span className="user-me-name">{user?.displayName}</span>
            </div>
          </div>
        </div>

        <div className="chat-layout">
          <div className="chat-sidebar">
            <div className="sidebar-section-title">💬 Rooms</div>
            <div className="sidebar-rooms">
              {TOPICS.map((topic) => (
                <button 
                  key={topic.id}
                  className={`sidebar-room-btn ${currentRoom?.id === topic.id ? 'active' : ''}`}
                  onClick={() => openRoom(topic.id, topic.emoji)}
                >
                  <span className="room-emoji">{topic.emoji}</span>
                  <span>{topic.name}</span>
                </button>
              ))}
            </div>
            <div className="sidebar-online-section">
              <div className="sidebar-online-title">🟢 In this room</div>
              <div id="online-users-list">
                {onlineUsers.map((u, idx) => (
                  <div key={idx} className="online-user-row">
                    <span className="online-user-dot"></span>
                    <span>{u.name || u.displayName} {u.name === user?.displayName || u.displayName === user?.displayName ? '(you)' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chat-main">
            <div className="chat-messages" ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div className="loading-msgs">
                  <div className="spinner"></div>
                  <span>Connecting to live chat…</span>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`msg-group ${msg.isMe ? 'is-me' : ''}`}>
                    {msg.author === 'System' ? (
                      <div className="sys-msg">{msg.text}</div>
                    ) : (
                      <>
                        <div className={`msg-header ${msg.isMe ? 'is-me' : ''}`}>
                          <span className={`msg-author ${msg.isMe ? 'is-me' : ''}`}>{msg.author}</span>
                          <span className="msg-time">{msg.time}</span>
                        </div>
                        <div className="msg-row">
                          <div className={`msg-avatar ${msg.isMe ? 'is-me' : ''}`}>
                            {msg.authorInitials || msg.author?.[0]}
                          </div>
                          <div className={`msg-bubble ${msg.isMe ? 'is-me' : ''}`}>
                            {msg.text}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="input-row">
                <input 
                  type="text" 
                  id="user-input" 
                  placeholder="Share your idea or solution…" 
                  maxLength="500" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <span className="char-count">{500 - inputText.length}</span>
                <button 
                  className="send-btn" 
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              <div className="input-hint">Press Enter to send · Be respectful · No spam</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="dashboard" style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(rgba(2, 12, 27, 0.88), rgba(2, 12, 27, 0.96)), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072) center/cover fixed', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 80px' }}>
      <div className="dash-nav">
        <a href="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="c-lang-btn active">EN</button>
          <button className="c-lang-btn">UZ</button>
          <button className="c-lang-btn">RU</button>
        </div>
        <div className="dash-user-chip">
          <div className="dash-chip-avatar">{user?.initials}</div>
          <span className="dash-chip-name">{user?.displayName}</span>
          <button className="dash-signout-btn" onClick={signOut}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </div>

      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.2rem, 7vw, 4rem)', color: 'white', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '8px', textShadow: '0 0 30px rgba(100, 255, 218, 0.4)', marginBottom: '12px' }}>Community Hub</h1>
      <div className="dash-subtitle">🌍 Live Global Brainstorm</div>
      <div className="dash-user-greeting">
        Welcome, <span>{user?.displayName}</span>! Select a challenge to join the live discussion.
      </div>

      <div className="topic-grid">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id} 
            className="topic-card" 
            onClick={() => openRoom(topic.id, topic.emoji)}
          >
            <div className="topic-emoji">{topic.emoji}</div>
            <div className="topic-name">{topic.name}</div>
            <div className="topic-live-count">
              <span className="live-dot"></span> Live chat
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community