import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              <i className="fas fa-globe-americas"></i>
              <span>GlobalProblemSolvers</span>
            </Link>
          </div>
          <div className="footer-links">
            <Link to="/#problems">Problems</Link>
            <Link to="/#about">About</Link>
            <Link to="/community">Community</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} GlobalProblemSolvers | Created by Baxtiyorov Otabek</p>
        </div>
      </div>
    </footer>
  )
}