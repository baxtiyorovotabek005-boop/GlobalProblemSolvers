import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './ProfileModal.css'

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  
  const { user, updateProfile } = useAuth()

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setDescription(user.description || '')
      setPhotoUrl(user.photoUrl || '')
    }
  }, [user])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('openProfileModal', handleOpen)
    return () => window.removeEventListener('openProfileModal', handleOpen)
  }, [])

  const close = () => setIsOpen(false)

  const handleSave = () => {
    updateProfile({ name, description, photoUrl })
    close()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoUrl(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="profile-modal">
        <div className="profile-header">
          <h2>Edit <span>Profile</span></h2>
          <button className="close-btn" onClick={close}><i className="fas fa-times"></i></button>
        </div>

        <div className="profile-preview">
          <div className="profile-avatar">
            {photoUrl ? <img src={photoUrl} alt="Profile" /> : name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="profile-info">
            <h3>{name || 'Your Name'}</h3>
            <p>{description || 'No description yet'}</p>
          </div>
          <label className="change-photo-btn">
            <i className="fas fa-camera"></i> Change Photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
          </label>
        </div>

        <div className="profile-form">
          <div className="field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="field">
            <label>Description / Bio</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
          </div>
          <div className="field">
            <label>Photo URL</label>
            <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><i className="fas fa-check"></i> Save Changes</button>
        </div>
      </div>
    </div>
  )
}