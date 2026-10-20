import { Link } from 'react-router-dom'
import NeonAtom from '../components/NeonAtom'

export default function HomePage() {
  return (
    <div className="page-view home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">A New Way to Learn</span>
          <h1 className="hero-title-main">
            <span className="gradient-text-chemlab">ChemLab</span>
            <br />
            <span className="white-text-interactive">Interactive</span>
          </h1>
          <p className="hero-description">
            A digital chemistry learning environment. Explore elements, visualize reactions, and connect with your classroom in an interactive, immersive way.
          </p>

          <div className="hero-actions">
            <Link to="/explore" className="action-btn action-btn-primary action-btn-neon">
              Start Exploring
            </Link>
            <Link to="/virtual-lab" className="action-btn action-btn-secondary">
              Enter Virtual Lab
            </Link>
          </div>
        </div>

        <div className="hero-panel-atom">
          <NeonAtom />
        </div>
      </section>

      <section className="home-highlights">
        <div className="highlight-card glass-card">
          <h4>All 118 Elements</h4>
          <p>From Hydrogen to Oganesson, every element is accessible in the Explore tab.</p>
        </div>
        <div className="highlight-card glass-card">
          <h4>Real-Time Data</h4>
          <p>Element state, category, and atomic details are packed into every factsheet.</p>
        </div>
        <div className="highlight-card glass-card">
          <h4>Immersive UI</h4>
          <p>Dark mode visuals with glassmorphism, neon accents, and animated chemistry effects.</p>
        </div>
      </section>
    </div>
  )
}
