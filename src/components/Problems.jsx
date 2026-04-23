import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Problems.css'

// Original images from the old website
const problemImages = {
  1: 'https://t3.ftcdn.net/jpg/05/73/96/92/360_F_573969248_rkDRwe3jOYGENhrF8tlVw7GFHqSXxq3j.jpg', // Climate
  2: 'https://static.vecteezy.com/system/resources/previews/031/608/655/non_2x/a-globe-on-top-of-a-grains-food-security-concept-ai-generated-photo.jpg', // Hunger
  3: 'https://img.freepik.com/free-photo/graduation-cap-with-globe-digital-art-style-education-day_23-2151164274.jpg', // Education
  4: 'https://thumbs.dreamstime.com/b/drought-concept-last-drop-rusty-tap-single-precious-water-falls-corroded-faucet-onto-parched-cracked-earth-below-415394430.jpg', // Water
  5: 'https://rmis.jrc.ec.europa.eu/images/air-pollution-41a05f.jpg', // Air Pollution
  6: 'https://t3.ftcdn.net/jpg/08/15/60/88/360_F_815608853_QxgVdtynDdym9S6TYk3HiuvrdEwgRCtO.jpg', // Deforestation
  7: 'https://thumbs.dreamstime.com/b/plastic-trash-plastic-bottle-floating-sea-sunset-plastic-pollution-ocean-ecological-crisis-say-no-to-plastic-430510161.jpg', // Ocean Plastic
  8: 'https://media.istockphoto.com/id/921644532/photo/stack-of-medical-student-textbooks.jpg', // Healthcare
  9: 'https://media.istockphoto.com/id/1309186924/photo/businessmen-were-offered-us-dollars-the-operator-refused-the-envelope-as-a-bribe-anti.jpg', // Corruption
  10: 'https://thumbs.dreamstime.com/b/concept-gender-inequality-discrimination-career-women-silhouette-big-hand-employer-prefers-male-employees-111861575.jpg' // Gender
}

const problems = [
  { id: 1, title: 'Climate Change', cause: 'Greenhouse gas emissions and fossil fuel reliance.', effect: 'Rising temperatures and extreme weather.', image: problemImages[1] },
  { id: 2, title: 'Global Hunger', cause: 'Poverty, war, and food waste.', effect: 'Chronic malnutrition and health crises.', image: problemImages[2] },
  { id: 3, title: 'Access to Education', cause: 'Financial barriers and lack of infrastructure.', effect: 'Limited skills and lifelong poverty cycles.', image: problemImages[3] },
  { id: 4, title: 'Water Scarcity', cause: 'Industrial pollution and droughts.', effect: 'Spread of diseases and crop failure.', image: problemImages[4] },
  { id: 5, title: 'Air Pollution', cause: 'Vehicle emissions and industrial smoke.', effect: 'Breathing illnesses and ozone damage.', image: problemImages[5] },
  { id: 6, title: 'Deforestation', cause: 'Agricultural expansion and logging.', effect: 'Wildlife extinction and climate imbalance.', image: problemImages[6] },
  { id: 7, title: 'Ocean Plastic', cause: 'Over-production of single-use plastics.', effect: 'Toxic oceans and marine death.', image: problemImages[7] },
  { id: 8, title: 'Healthcare Access', cause: 'Economic inequality and rural distance.', effect: 'Untreated illness and lower life expectancy.', image: problemImages[8] },
  { id: 9, title: 'Corruption', cause: 'Bribery and lack of transparency.', effect: 'Economic stagnation and social injustice.', image: problemImages[9] },
  { id: 10, title: 'Gender Inequality', cause: 'Social norms and unequal opportunities.', effect: 'Reduced growth and human rights violations.', image: problemImages[10] }
]

function ProblemCard({ problem, onUnlock }) {
  const { isLoggedIn } = useAuth()
  const [solution, setSolution] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submitted:', { problem: problem.title, solution, email })
    setSubmitted(true)
  }

  return (
    <div className="problem-card">
      <div className="problem-image">
        <img src={problem.image} alt={problem.title} />
      </div>
      <div className="problem-content">
        <h3 className="problem-title">{problem.id}. {problem.title}</h3>
        <div className="problem-meta">
          <p className="cause">
            <strong>Causes:</strong> {problem.cause}
          </p>
          <p className="effect">
            <strong>Effects:</strong> {problem.effect}
          </p>
        </div>
        
        {!isLoggedIn ? (
          <div className="form-lock" onClick={onUnlock}>
            <i className="fas fa-lock"></i>
            <span>Log in to submit your solution</span>
          </div>
        ) : submitted ? (
          <div className="submission-success">
            <i className="fas fa-check-circle"></i>
            <span>Solution submitted successfully!</span>
          </div>
        ) : (
          <form className="solution-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <textarea 
              placeholder="Your solution idea..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              minLength={50}
              required
            />
            <button type="submit" className="btn btn-primary">
              Submit Solution
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Problems() {
  const handleUnlock = () => {
    window.dispatchEvent(new CustomEvent('openLoginModal'))
  }

  return (
    <section id="problems" className="section problems-section">
      <div className="container">
        <h2 className="section-title">10 Global Challenges</h2>
        <div className="problems-grid">
          {problems.map(problem => (
            <ProblemCard 
              key={problem.id} 
              problem={problem} 
              onUnlock={handleUnlock} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}