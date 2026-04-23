import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './LoginModal.css'

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Brazil', 'Bulgaria', 'Cambodia',
  'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba', 'Czech Republic', 'Denmark',
  'Ecuador', 'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hungary',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Kyrgyzstan', 'Malaysia', 'Mexico', 'Morocco', 'Myanmar', 'Nepal',
  'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Palestine', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
]

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [errors, setErrors] = useState({})
  
  const { login, isLoggedIn } = useAuth()

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('openLoginModal', handleOpen)
    return () => window.removeEventListener('openLoginModal', handleOpen)
  }, [])

  useEffect(() => {
    if (isLoggedIn) setIsOpen(false)
  }, [isLoggedIn])

  const close = () => setIsOpen(false)

  const validateStep1 = () => {
    const err = {}
    if (!name || name.trim().length < 2) err.name = 'Please enter at least 2 characters'
    if (!age || age < 10 || age > 120) err.age = 'Please enter a valid age (10-120)'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const validateStep2 = () => {
    const err = {}
    if (!country) err.country = 'Please select your country'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1))
    setErrors({})
  }

  const skipPhone = () => {
    setPhone('-')
    setStep(3)
  }

  const handleSubmit = () => {
    login({ name: name.trim(), country, age: parseInt(age), phone: phone || '-' })
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="login-modal">
        <button className="close-btn" onClick={close}>
          <i className="fas fa-times"></i>
        </button>

        <div className="login-header">
          <div className="login-icon"><i className="fas fa-globe-americas"></i></div>
          <h2>Join <span>GPS</span></h2>
          <p>Create your profile to submit solutions</p>
        </div>

        <div className="login-progress">
          <div className={`dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {step === 1 && (
          <div className="login-step">
            <h3>Who are you?</h3>
            <div className="field">
              <label><i className="fas fa-user"></i> Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="field">
              <label><i className="fas fa-birthday-cake"></i> Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your age" min="10" max="120" />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>
            <button className="btn btn-primary" onClick={nextStep}>
              Continue <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="login-step">
            <h3>Where are you from?</h3>
            <div className="field">
              <label><i className="fas fa-phone"></i> Phone <span className="optional">(Optional)</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
              <button type="button" className="skip-btn" onClick={skipPhone}>Skip</button>
            </div>
            <div className="field">
              <label><i className="fas fa-flag"></i> Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select your country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <span className="error">{errors.country}</span>}
            </div>
            <div className="btn-row">
              <button className="btn" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Continue <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="login-step">
            <h3>Almost there!</h3>
            <div className="summary">
              <div className="summary-row"><i className="fas fa-user"></i> {name}</div>
              <div className="summary-row"><i className="fas fa-birthday-cake"></i> {age} years old</div>
              <div className="summary-row"><i className="fas fa-phone"></i> {phone || 'Not provided'}</div>
              <div className="summary-row"><i className="fas fa-flag"></i> {country}</div>
            </div>
            <div className="btn-row">
              <button className="btn" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={handleSubmit}><i className="fas fa-check"></i> Confirm & Join</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}