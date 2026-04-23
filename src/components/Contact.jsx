export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Join the Movement</h2>
        <div className="contact-card">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h4>Email</h4>
              <a href="mailto:baxtiyorovotabek@gmail.com">baxtiyorovotabek@gmail.com</a>
            </div>
          </div>
          <div className="contact-item">
            <i className="fab fa-telegram"></i>
            <div>
              <h4>Telegram</h4>
              <a href="https://t.me/globalproblemsolvers" target="_blank" rel="noopener">
                Join our Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}