import { useAuth } from '../context/AuthContext'
import { useTranslations } from '../context/TranslationsContext'
import { Trophy, Star, Zap, Calendar, TrendingUp, Award } from 'lucide-react'
import './Statistics.css'

export default function Statistics() {
  const { user, xp, level, getLevelTitle, solutions, achievements, dailyStreak, getTotalRating, getTodaySolutions, getWeekSolutions } = useAuth()
  const { t } = useTranslations()

  const todayCount = getTodaySolutions().length
  const weekCount = getWeekSolutions().length
  const totalRating = getTotalRating()

  const levelProgress = () => {
    const currentThreshold = (level - 1) * 500
    const nextThreshold = level * 500
    const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const stats = [
    { icon: Star, label: 'Total XP', value: xp.toLocaleString(), color: '#fbbf24' },
    { icon: Trophy, label: 'Level', value: level, subtitle: getLevelTitle(level), color: '#8b5cf6' },
    { icon: Zap, label: 'Solutions', value: solutions.length, color: '#10b981' },
    { icon: Calendar, label: 'Daily Streak', value: dailyStreak, subtitle: 'days', color: '#f97316' },
    { icon: TrendingUp, label: 'Avg Rating', value: solutions.length > 0 ? (totalRating / solutions.length).toFixed(1) : '0', color: '#06b6d4' },
    { icon: Award, label: 'Badges', value: achievements.length, color: '#ec4899' }
  ]

  const recentSolutions = [...solutions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>Statistics</h1>
        <p>Track your progress and achievements</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              {stat.subtitle && <span className="stat-subtitle">{stat.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="stats-sections">
        <div className="stats-section">
          <h2><TrendingUp size={20} /> Level Progress</h2>
          <div className="level-bar">
            <div className="level-bar-fill" style={{ width: `${levelProgress()}%` }}></div>
          </div>
          <p className="level-info">Level {level} - {getLevelTitle(level)}</p>
        </div>

        <div className="stats-section">
          <h2><Calendar size={20} /> Activity</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <span className="activity-value">{todayCount}</span>
              <span className="activity-label">Today</span>
            </div>
            <div className="activity-item">
              <span className="activity-value">{weekCount}</span>
              <span className="activity-label">This Week</span>
            </div>
            <div className="activity-item">
              <span className="activity-value">{solutions.length}</span>
              <span className="activity-label">Total</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2><Star size={20} /> Recent Solutions</h2>
          {recentSolutions.length === 0 ? (
            <p className="empty-state">No solutions submitted yet</p>
          ) : (
            <div className="solutions-list">
              {recentSolutions.map((sol, i) => (
                <div key={i} className="solution-item">
                  <div className="solution-title">{sol.problemTitle}</div>
                  <div className="solution-meta">
                    <span>Rating: {sol.totalRating || 0}</span>
                    <span>XP: +{sol.xp || 0}</span>
                    <span>{new Date(sol.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-section">
          <h2><Award size={20} /> Badges Earned</h2>
          {achievements.length === 0 ? (
            <p className="empty-state">No badges earned yet. Submit solutions to earn badges!</p>
          ) : (
            <div className="badges-list">
              {achievements.map((ach, i) => (
                <div key={i} className="badge-item">
                  <span className="badge-icon">{ach.type === 'xp' ? '⭐' : '🏆'}</span>
                  <div className="badge-info">
                    <span className="badge-title">{ach.title}</span>
                    <span className="badge-desc">{ach.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}