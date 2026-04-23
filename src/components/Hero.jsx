import { ArrowRight, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslations } from '../context/TranslationsContext'
import './Hero.css'

export default function Hero() {
  const { t } = useTranslations()

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Solutions from the <span className="highlight">People</span>
        </h1>
        <p className="hero-subtitle">
          {t.hero.subtitle}
        </p>
        <div className="hero-cta">
          <Link to="/#problems" className="btn btn-primary">
            <ArrowRight size={16} /> {t.hero.cta}
          </Link>
          <Link to="/community" className="btn">
            {t.hero.cta2}
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <Share2 size={18} className="stat-icon" />
            <span className="stat-number">10</span>
            <span className="stat-label">{t.hero.stats.challenges}</span>
          </div>
          <div className="stat">
            <Share2 size={18} className="stat-icon" />
            <span className="stat-number">150+</span>
            <span className="stat-label">{t.hero.stats.solutions}</span>
          </div>
          <div className="stat">
            <Share2 size={18} className="stat-icon" />
            <span className="stat-number">30+</span>
            <span className="stat-label">{t.hero.stats.countries}</span>
          </div>
        </div>
      </div>
    </section>
  )
}