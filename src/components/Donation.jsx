import './Donation.css'

export default function Donation() {
  const tiers = [
    { name: 'Buy a Coffee', amount: '$3', desc: 'Fuel one coding session!', icon: '☕' },
    { name: 'Supporter', amount: '$10', desc: 'Keep GPS online for a month!', icon: '🚀', popular: true },
    { name: 'Champion', amount: '$25', desc: 'Sponsor a new problem category!', icon: '🌍' },
    { name: 'Hero', amount: '$50+', desc: 'Fund AI features and global outreach.', icon: '🏆' }
  ]

  return (
    <section className="section donation-section">
      <div className="container">
        <h2 className="section-title">Support the Mission</h2>
        <p className="donation-subtitle">
          GPS is free for everyone, forever. If you find it valuable, 
          a small contribution keeps the servers running.
        </p>
        
        <div className="donation-grid">
          {tiers.map((tier, i) => (
            <div key={i} className={`donation-tier ${tier.popular ? 'featured' : ''}`}>
              {tier.popular && <span className="popular-badge">Most Popular</span>}
              <span className="tier-icon">{tier.icon}</span>
              <h4 className="tier-name">{tier.name}</h4>
              <div className="tier-amount">{tier.amount}</div>
              <p className="tier-desc">{tier.desc}</p>
              <button className="btn">Donate {tier.amount}</button>
            </div>
          ))}
        </div>

        <div className="donation-box">
          <p>
            All donations go directly to server costs, domain renewal, and future development. 
            Every dollar counts — thank you!
          </p>
          <a href="https://ko-fi.com/baxtiyorovotabek" target="_blank" rel="noopener" className="btn btn-primary">
            <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="" /> Support on Ko-fi
          </a>
        </div>
      </div>
    </section>
  )
}