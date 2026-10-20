import { Link } from 'react-router-dom'

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="page-view">
      <section className="placeholder-page glass-card">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="placeholder-actions">
          <Link to="/explore" className="action-btn action-btn-primary">
            Visit Explore
          </Link>
          <Link to="/" className="action-btn action-btn-secondary">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
