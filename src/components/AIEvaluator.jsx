import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AIEvaluator.css'

export default function AIEvaluator({ solution, onClose }) {
  const [step, setStep] = useState('loading')
  const [result, setResult] = useState(null)
  const [xpGained, setXpGained] = useState(0)

  const { addXpFromAI } = useAuth()

  const runEvaluation = async () => {
    setStep('loading')
    
    // Simulate AI evaluation (in production, use Claude API or local model)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate realistic assessment
    const ratings = {
      impact: Math.floor(Math.random() * 4) + 6,      // 6-9
      feasibility: Math.floor(Math.random() * 4) + 6, // 6-9
      innovation: Math.floor(Math.random() * 4) + 5     // 5-8
    }
    
    const total = (ratings.impact + ratings.feasibility + ratings.innovation) / 3
    const verdict = total >= 8 ? 'Excellent' : total >= 7 ? 'Good' : total >= 6 ? 'Average' : 'Needs Work'
    
    const feedback = {
      ratings,
      total: total.toFixed(1),
      verdict,
      strengths: [
        'Clear problem identification',
        'Practical approach mentioned',
        total >= 7 && 'Innovative thinking'
      ].filter(Boolean),
      weaknesses: [
        total < 8 && 'Could include more specific metrics',
        total < 7 && 'Consider environmental impact more'
      ].filter(Boolean),
      suggestions: [
        'Add timeline for implementation',
        'Consider stakeholder engagement',
        'Include budget estimation'
      ].slice(0, 2)
    }
    
    setResult(feedback)
    setStep('result')
    
    // Add XP
    const xp = addXpFromAI(solution?.id || Date.now(), ratings)
    setXpGained(xp)
  }

  // Auto-run evaluation
  if (step === 'loading') {
    setTimeout(runEvaluation, 500)
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#4caf7d'
    if (score >= 6) return 'var(--accent)'
    return '#ff7043'
  }

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={e => e.stopPropagation()}>
        <div className="ai-header">
          <h2>🤖 AI Solution Evaluator</h2>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        {step === 'loading' && (
          <div className="ai-loading">
            <div className="spinner"></div>
            <p>Analysing your solution...</p>
            <div className="loading-steps">
              <span>Evaluating Impact...</span>
              <span>Testing Feasibility...</span>
              <span>Assessing Innovation...</span>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="ai-result">
            <div className="ai-score-ring">
              <div 
                className="score-circle" 
                style={{ 
                  background: `conic-gradient(${getScoreColor(result.total)} ${(parseFloat(result.total)/10)*100}%, transparent 0%)` 
                }}
              >
                <span className="score-num">{result.total}</span>
              </div>
              <div className="score-info">
                <span className="verdict">{result.verdict}</span>
              </div>
            </div>

            <div className="ai-subscores">
              <div className="sub-score">
                <span>Impact</span>
                <div className="bar"><div style={{ width: `${result.ratings.impact * 10}%`, background: getScoreColor(result.ratings.impact) }}></div></div>
                <span className="val">{result.ratings.impact}</span>
              </div>
              <div className="sub-score">
                <span>Feasibility</span>
                <div className="bar"><div style={{ width: `${result.ratings.feasibility * 10}%`, background: getScoreColor(result.ratings.feasibility) }}></div></div>
                <span className="val">{result.ratings.feasibility}</span>
              </div>
              <div className="sub-score">
                <span>Innovation</span>
                <div className="bar"><div style={{ width: `${result.ratings.innovation * 10}%`, background: getScoreColor(result.ratings.innovation) }}></div></div>
                <span className="val">{result.ratings.innovation}</span>
              </div>
            </div>

            <div className="ai-feedback">
              <div className="feedback-section">
                <h4>✓ Strengths</h4>
                <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="feedback-section">
                <h4>⚠ Areas to Improve</h4>
                <ul>{result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
              <div className="feedback-section">
                <h4>💡 Suggestions</h4>
                <ul>{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>

            <div className="ai-xp-earned">
              <i className="fas fa-star"></i>
              <span>+{xpGained} XP Earned!</span>
            </div>

            <button className="btn btn-primary" onClick={onClose}>Continue</button>
          </div>
        )}
      </div>
    </div>
  )
}