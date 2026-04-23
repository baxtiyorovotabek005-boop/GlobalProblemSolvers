import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Globe2, Menu, X, Sun, Moon, ChevronDown, LogOut, User, Settings, BarChart2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslations } from '../context/TranslationsContext'
import './Header.css'

const languageFlags = {
  en: 'EN',
  uz: 'UZ',
  ru: 'RU'
}

const languageNames = {
  en: 'English',
  uz: 'Ozbek',
  ru: 'Russkiy'
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()
  const { lang, changeLang, t } = useTranslations()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/#problems', label: t.nav.problems },
    { path: '/#achievements', label: t.nav.achievements },
    { path: '/#contact', label: t.nav.contact },
    { path: '/community', label: t.nav.community }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Globe2 className="logo-icon" />
          <span className="logo-text">
            <span className="red">G</span>lobal<span className="red">P</span>roblem<span className="red">S</span>olvers
          </span>
        </Link>

        <button className={`hamburger ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`} 
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isLoggedIn && <XPDisplay />}
          
          {isLoggedIn ? (
            <div className="dropdown-container">
              <button 
                className="user-badge" 
                onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); setThemeOpen(false); }}
              >
                <div className="user-avatar">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} />
                  ) : (
                    user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                  )}
                </div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={profileOpen ? 'rotated' : ''} />
              </button>
              <div className={`dropdown-menu profile-dropdown ${profileOpen ? 'open' : ''}`}>
                <button 
                  className="dropdown-item"
                  onClick={() => { window.dispatchEvent(new CustomEvent('openProfileModal')); setProfileOpen(false); }}
                >
                  <Settings size={16} /> Customize Profile
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => { navigate('/statistics'); setProfileOpen(false); }}
                >
                  <BarChart2 size={16} /> Statistics
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={() => { logout(); setProfileOpen(false); }}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/" className="login-btn" onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}>
              <User size={14} /> Log In
            </Link>
          )}

          {/* Language Switcher */}
          <div className="dropdown-container">
            <button className="dropdown-btn lang-btn" onClick={() => { setLangOpen(!langOpen); setThemeOpen(false); }}>
              <Globe2 size={16} />
              <span className="lang-flag">{languageFlags[lang]}</span>
              <ChevronDown size={12} className={langOpen ? 'rotated' : ''} />
            </button>
            <div className={`dropdown-menu ${langOpen ? 'open' : ''}`}>
              {Object.keys(languageFlags).map((code) => (
                <button 
                  key={code} 
                  className={`dropdown-item ${lang === code ? 'active' : ''}`}
                  onClick={() => { changeLang(code); setLangOpen(false); }}
                >
                  <span className="lang-flag">{languageFlags[code]}</span>
                  <span className="lang-name">{languageNames[code]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="dropdown-container">
            <button className="dropdown-btn theme-btn" onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); }}>
              <Sun size={16} />
            </button>
            <div className={`dropdown-menu ${themeOpen ? 'open' : ''}`}>
              <button className="dropdown-item" onClick={() => { document.body.classList.remove('light-mode'); setThemeOpen(false); }}>
                <Moon size={16} /> Dark Mode
              </button>
              <button className="dropdown-item" onClick={() => { document.body.classList.add('light-mode'); setThemeOpen(false); }}>
                <Sun size={16} /> Light Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}