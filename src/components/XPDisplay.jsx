import { useAuth } from '../context/AuthContext'
import './XPDisplay.css'

export default function XPDisplay() {
  const { user, xp, level, getLevelTitle, dailyStreak, onlineCount, solutions } = useAuth()

  if (!user) return null

  const currentThreshold = level > 1 ? (level - 1) * 1000 : 0
  const nextThreshold = level < 10 ? level * 1000 : level * 1000
  const progress = nextThreshold > currentThreshold ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100 : 100

  return (
    <div className="xp-display">
      <div className="xp-level">
        <span className="level-badge">LVL {level}</span>
        <span className="level-title">{getLevelTitle(level)}</span>
      </div>
      
      <div className="xp-progress">
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <div className="xp-numbers">
          <span>{xp.toLocaleString()} XP</span>
          <span>{nextThreshold.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="xp-stats">
        <div className="stat-item">
          <i className="fas fa-fire"></i>
          <span className="stat-value">{dailyStreak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-users"></i>
          <span className="stat-value">{onlineCount}</span>
          <span className="stat-label">Online</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-lightbulb"></i>
          <span className="stat-value">{solutions.length}</span>
          <span className="stat-label">Solutions</span>
        </div>
      </div>
    </div>
  )
}