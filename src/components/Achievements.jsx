import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Achievements.css'

export default function Achievements() {
  const { solutions, achievements, xp, level, getTotalRating } = useAuth()
  const [activeTab, setActiveTab] = useState('achievements')

  const topSolutions = [...solutions]
    .sort((a, b) => (b.totalRating || 0) - (a.totalRating || 0))
    .slice(0, 5)

  const todaySolutions = solutions.filter(s => s.date === new Date().toDateString())
  const weekSolutions = solutions.filter(s => s.timestamp > Date.now() - 7 * 86400000)

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <section id="achievements" className="achievements-section">
      <div className="container">
        <h2 className="section-title">🏆 Hall of Fame</h2>
        
        <div className="achievements-tabs">
          <button 
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} 
            onClick={() => setActiveTab('achievements')}
          >
            <i className="fas fa-trophy"></i> Achievements
          </button>
          <button 
            className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`} 
            onClick={() => setActiveTab('track')}
          >
            <i className="fas fa-chart-line"></i> Track Progress
          </button>
        </div>

        {activeTab === 'achievements' && (
          <div className="achievements-grid">
            {/* XP Progress */}
            <div className="achievement-card featured">
              <div className="ach-icon">⭐</div>
              <div className="ach-content">
                <h3>Total XP</h3>
                <div className="ach-value">{xp.toLocaleString()}</div>
                <p>Level {level} - Keep earning!</p>
              </div>
            </div>

            {/* Today's Solutions */}
            <div className="achievement-card">
              <div className="ach-icon">📝</div>
              <div className="ach-content">
                <h3>Today</h3>
                <div className="ach-value">{todaySolutions.length}</div>
                <p>Solutions submitted</p>
              </div>
            </div>

            {/* Week Solutions */}
            <div className="achievement-card">
              <div className="ach-icon">📅</div>
              <div className="ach-content">
                <h3>This Week</h3>
                <div className="ach-value">{weekSolutions.length}</div>
                <p>Solutions submitted</p>
              </div>
            </div>

            {/* Total Rating */}
            <div className="achievement-card">
              <div className="ach-icon">⭐</div>
              <div className="ach-content">
                <h3>Rating</h3>
                <div className="ach-value">{getTotalRating().toFixed(1)}</div>
                <p>AI Assessment Score</p>
              </div>
            </div>

            {/* Achievements List */}
            <div className="achievements-list">
              <h3>Your Badges</h3>
              {achievements.length === 0 ? (
                <p className="empty">No achievements yet. Submit solutions to earn badges!</p>
              ) : (
                <div className="badges-grid">
                  {achievements.map((ach, i) => (
                    <div key={i} className="badge">
                      <i className={`fas ${ach.type === 'xp' ? 'fa-star' : 'fa-lightbulb'}`}></i>
                      <span className="badge-title">{ach.title}</span>
                      <span className="badge-desc">{ach.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="track-content">
            {/* My Solutions */}
            <div className="track-section">
              <h3>My Solutions</h3>
              {solutions.length === 0 ? (
                <p className="empty">No solutions submitted yet.</p>
              ) : (
                <div className="solutions-list">
                  {solutions.slice().reverse().map(sol => (
                    <div key={sol.id} className="solution-item">
                      <div className="sol-header">
                        <span className="sol-problem">{sol.problemTitle}</span>
                        <span className="sol-date">{formatDate(sol.timestamp)}</span>
                      </div>
                      <p className="sol-text">{sol.solution?.slice(0, 100)}...</p>
                      {sol.totalRating > 0 && (
                        <div className="sol-rating">
                          <span>Impact: {sol.ratings?.impact || 0}</span>
                          <span>Feasibility: {sol.ratings?.feasibility || 0}</span>
                          <span>Innovation: {sol.ratings?.innovation || 0}</span>
                          <span className="total">Total: {sol.totalRating}</span>
                        </div>
                      )}
                      <div className="sol-xp">
                        <i className="fas fa-star"></i> +{sol.xp || 0} XP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Leaderboard */}
            <div className="track-section">
              <h3>🌟 Daily Top Solutions</h3>
              <div className="leaderboard">
                {topSolutions.filter(s => s.date === new Date().toDateString()).length === 0 ? (
                  <p className="empty">No solutions today yet.</p>
                ) : (
                  topSolutions
                    .filter(s => s.date === new Date().toDateString())
                    .slice(0, 3)
                    .map((sol, i) => (
                      <div key={sol.id} className="leader-item">
                        <span className="rank">#{i + 1}</span>
                        <span className="name">{sol.problemTitle}</span>
                        <span className="rating">{sol.totalRating || 0}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Annual Leaderboard */}
            <div className="track-section">
              <h3>🏆 Annual Top Solutions</h3>
              <div className="leaderboard">
                {topSolutions.length === 0 ? (
                  <p className="empty">No solutions yet.</p>
                ) : (
                  topSolutions.slice(0, 5).map((sol, i) => (
                    <div key={sol.id} className="leader-item">
                      <span className="rank">#{i + 1}</span>
                      <span className="name">{sol.problemTitle}</span>
                      <span className="rating">{sol.totalRating || 0}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}