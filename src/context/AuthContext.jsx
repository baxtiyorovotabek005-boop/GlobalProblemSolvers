import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Default profile image (simple SVG placeholder)
const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="35" r="20" fill="#64fab5"/>
    <circle cx="50" cy="75" r="30" fill="#64fab5"/>
  </svg>
`)
const STREAK_KEY = 'gps_streak'
const SOLUTIONS_KEY = 'gps_solutions'
const ACHIEVEMENTS_KEY = 'gps_achievements'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [solutions, setSolutions] = useState([])
  const [achievements, setAchievements] = useState([])
  const [dailyStreak, setDailyStreak] = useState(0)
  const [lastLoginDate, setLastLoginDate] = useState(null)
  const [onlineCount, setOnlineCount] = useState(1)

  // XP definitions
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000]
  const levelTitles = ['Newcomer', 'Contributor', 'Solver', 'Innovator', 'Expert', 'Champion', 'Legend', 'Master', 'Elite', 'Grandmaster']

  // Initialize from localStorage
  useEffect(() => {
    // Restore user session
    const saved = localStorage.getItem('gps_user')
    if (saved) {
      try {
        const session = JSON.parse(saved)
        if (session.expiresAt && Date.now() < session.expiresAt) {
          setUser({ name: session.name, country: session.country, description: session.description, photoUrl: session.photoUrl, age: session.age })
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem('gps_user')
        }
      } catch (e) {
        localStorage.removeItem('gps_user')
      }
    }

    // Restore XP
    const savedXp = localStorage.getItem(XP_KEY)
    if (savedXp) {
      try {
        const xpData = JSON.parse(savedXp)
        setXp(xpData.total || 0)
        setLevel(calculateLevel(xpData.total || 0))
      } catch (e) {}
    }

    // Restore solutions
    const savedSolutions = localStorage.getItem(SOLUTIONS_KEY)
    if (savedSolutions) {
      try {
        setSolutions(JSON.parse(savedSolutions))
      } catch (e) {}
    }

    // Restore achievements
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements))
      } catch (e) {}
    }

    // Restore streak
    const savedStreak = localStorage.getItem(STREAK_KEY)
    if (savedStreak) {
      try {
        const streakData = JSON.parse(savedStreak)
        setDailyStreak(streakData.current || 0)
        setLastLoginDate(streakData.lastDate || null)
      } catch (e) {}
    }

    // Simulate online users (in production, use Firebase Realtime DB)
    simulateOnlineUsers()
  }, [])

  // Check and update streak on login
  useEffect(() => {
    if (isLoggedIn) {
      checkAndUpdateStreak()
    }
  }, [isLoggedIn])

  const simulateOnlineUsers = () => {
    // In production, this would be real-time from Firebase
    setInterval(() => {
      const base = 1
      const variation = Math.floor(Math.random() * 5)
      setOnlineCount(base + variation)
    }, 5000)
  }

  const calculateLevel = (totalXp) => {
    for (let i = xpThresholds.length - 1; i >= 0; i--) {
      if (totalXp >= xpThresholds[i]) return i + 1
    }
    return 1
  }

  const getLevelTitle = (lvl) => levelTitles[Math.min(lvl - 1, levelTitles.length - 1)]

  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastLoginDate === today) {
      return // Already logged in today
    } else if (lastLoginDate === yesterday) {
      // Consecutive day - increase streak
      const newStreak = dailyStreak + 1
      setDailyStreak(newStreak)
      setLastLoginDate(today)
      saveStreak(newStreak, today)
    } else {
      // Streak broken - reset
      setDailyStreak(1)
      setLastLoginDate(today)
      saveStreak(1, today)
    }
  }

  const saveStreak = (streak, date) => {
    localStorage.setItem(STREAK_KEY, JSON.stringify({ current: streak, lastDate: date }))
  }

  const login = (userData) => {
    const session = {
      ...userData,
      photoUrl: userData.photoUrl || DEFAULT_AVATAR,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    }
    localStorage.setItem('gps_user', JSON.stringify(session))
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('gps_user')
    setUser(null)
    setIsLoggedIn(false)
  }

  const updateProfile = (updates) => {
    if (user) {
      const updated = { ...user, ...updates }
      const session = { ...updated, expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) }
      localStorage.setItem('gps_user', JSON.stringify(session))
      setUser(updated)
    }
  }

  const addSolution = (problemId, problemTitle, solution) => {
    const newSolution = {
      id: Date.now(),
      problemId,
      problemTitle,
      solution,
      xp: 0,
      timestamp: Date.now(),
      date: new Date().toDateString(),
      ratings: { impact: 0, feasibility: 0, innovation: 0 },
      totalRating: 0
    }
    const updated = [...solutions, newSolution]
    setSolutions(updated)
    localStorage.setItem(SOLUTIONS_KEY, JSON.stringify(updated))
    return newSolution
  }

  const addXpFromAI = (solutionId, ratings) => {
    // Calculate XP from AI assessment
    const { impact, feasibility, innovation } = ratings
    const totalRating = (impact + feasibility + innovation) / 3
    const xpGained = Math.round(totalRating * 10) // 10 XP per point
    
    const newXp = xp + xpGained
    const newLevel = calculateLevel(newXp)
    
    setXp(newXp)
    setLevel(newLevel)
    
    // Save XP
    localStorage.setItem(XP_KEY, JSON.stringify({
      total: newXp,
      level: newLevel,
      lastUpdated: Date.now()
    }))

    // Update solution with ratings
    const updated = solutions.map(s => {
      if (s.id === solutionId) {
        return {
          ...s,
          xp: xpGained,
          ratings,
          totalRating: Math.round(totalRating * 10) / 10,
          assessedAt: Date.now()
        }
      }
      return s
    })
    setSolutions(updated)
    localStorage.setItem(SOLUTIONS_KEY, JSON.stringify(updated))

    // Check for achievements
    checkAchievements(newXp, updated.length)

    return xpGained
  }

  const checkAchievements = (totalXp, solutionCount) => {
    const newAchievements = [...achievements]
    
    // XP-based achievements
    const xpMilestones = [
      { xp: 100, title: 'First Steps', desc: 'Earned 100 XP' },
      { xp: 500, title: 'Rising Star', desc: 'Earned 500 XP' },
      { xp: 1000, title: 'Problem Solver', desc: 'Earned 1000 XP' },
      { xp: 5000, title: 'Champion', desc: 'Earned 5000 XP' },
      { xp: 10000, title: 'Legend', desc: 'Earned 10000 XP' }
    ]
    
    xpMilestones.forEach(m => {
      if (totalXp >= m.xp && !newAchievements.find(a => a.title === m.title)) {
        newAchievements.push({
          title: m.title,
          desc: m.desc,
          type: 'xp',
          date: new Date().toISOString()
        })
      }
    })

    // Solution count achievements
    if (solutionCount >= 1 && !newAchievements.find(a => a.title === 'First Solution')) {
      newAchievements.push({ title: 'First Solution', desc: 'Submitted your first solution', type: 'solution', date: new Date().toISOString() })
    }
    if (solutionCount >= 10 && !newAchievements.find(a => a.title === 'Prolific Solver')) {
      newAchievements.push({ title: 'Prolific Solver', desc: 'Submitted 10 solutions', type: 'solution', date: new Date().toISOString() })
    }

    setAchievements(newAchievements)
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(newAchievements))
  }

  const getTodaySolutions = useCallback(() => {
    const today = new Date().toDateString()
    return solutions.filter(s => s.date === today)
  }, [solutions])

  const getWeekSolutions = useCallback(() => {
    const weekAgo = Date.now() - 7 * 86400000
    return solutions.filter(s => s.timestamp > weekAgo)
  }, [solutions])

  const getTotalRating = useCallback(() => {
    return solutions.reduce((sum, s) => sum + (s.totalRating || 0), 0)
  }, [solutions])

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, login, logout, updateProfile,
      xp, level, getLevelTitle, xpThresholds,
      solutions, addSolution, addXpFromAI,
      achievements,
      dailyStreak, lastLoginDate,
      onlineCount,
      getTodaySolutions, getWeekSolutions, getTotalRating
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}