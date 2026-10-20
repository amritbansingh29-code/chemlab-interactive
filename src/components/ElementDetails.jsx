import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'
import TestTube3D from './TestTube3D'

export default function ElementDetails({ element, onClose, onLoadLeft, onLoadRight }) {
  const navigate = useNavigate()
  if (!element) return null

  // Format custom styles for badge border
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Alkali metal': return 'var(--cat-alkali-metal)'
      case 'Alkaline earth metal': return 'var(--cat-alkaline-earth-metal)'
      case 'Transition metal': return 'var(--cat-transition-metal)'
      case 'Post-transition metal': return 'var(--cat-post-transition-metal)'
      case 'Metalloid': return 'var(--cat-metalloid)'
      case 'Nonmetal': return 'var(--cat-nonmetal)'
      case 'Halogen': return 'var(--cat-halogen)'
      case 'Noble gas': return 'var(--cat-noble-gas)'
      case 'Lanthanide': return 'var(--cat-lanthanide)'
      case 'Actinide': return 'var(--cat-actinide)'
      case 'Acid': return 'var(--cat-acid)'
      case 'Base': return 'var(--cat-base)'
      case 'Salt': return 'var(--cat-salt)'
      case 'Oxide': return 'var(--cat-oxide)'
      case 'Organic': return 'var(--cat-organic)'
      default: return 'var(--cat-unknown)'
    }
  }

  const catColor = getCategoryColor(element.category)

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} aria-label="Close details">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header Block */}
        <div className="drawer-header">
          <div className="element-badge" style={{ '--badge-color': catColor, '--badge-glow': catColor + '20' }}>
            {!element.isCompound && <span className="element-badge-num">{element.atomicNumber}</span>}
            <span className="element-badge-sym" style={element.isCompound ? { fontSize: '1.4rem', top: '50%', transform: 'translateY(-50%)' } : {}}>{element.symbol}</span>
          </div>
          <div className="header-text">
            <h2>{element.name}</h2>
            <span 
              className="category-tag" 
              style={{ 
                '--tag-bg': catColor + '15', 
                '--tag-color': catColor, 
                '--tag-border': catColor + '30' 
              }}
            >
              {element.category}
            </span>
          </div>
        </div>

        {/* Factsheet Dual-Column body */}
        <div className="drawer-body">
          {/* Fact list (Left Side) */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">{element.isCompound ? 'Reactant Type' : 'Atomic Number'}</div>
              <div className="info-value">{element.isCompound ? 'Compound' : element.atomicNumber}</div>
            </div>
            
            <div className="info-card">
              <div className="info-label">{element.isCompound ? 'Molecular Mass' : 'Atomic Mass'}</div>
              <div className="info-value">{element.atomicWeight} {element.isCompound ? 'g/mol' : 'u'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Standard State</div>
              <div className="info-value">{element.standardState || 'N/A'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Density</div>
              <div className="info-value">{element.density || 'N/A'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Melting Point</div>
              <div className="info-value">{element.meltingPoint || 'N/A'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Boiling Point</div>
              <div className="info-value">{element.boilingPoint || 'N/A'}</div>
            </div>

            {element.electronConfiguration && element.electronConfiguration !== 'N/A' && (
              <div className="info-card">
                <div className="info-label">Electron Configuration</div>
                <div className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {element.electronConfiguration}
                </div>
              </div>
            )}

            {element.electronegativity && element.electronegativity !== 'N/A' && (
              <div className="info-card">
                <div className="info-label">Electronegativity (Pauling)</div>
                <div className="info-value">{element.electronegativity}</div>
              </div>
            )}

            {element.atomicRadius && element.atomicRadius !== 'N/A' && (
              <div className="info-card">
                <div className="info-label">Atomic Radius</div>
                <div className="info-value">{element.atomicRadius}</div>
              </div>
            )}

            {element.ionizationEnergy && element.ionizationEnergy !== 'N/A' && (
              <div className="info-card">
                <div className="info-label">Ionization Energy</div>
                <div className="info-value">{element.ionizationEnergy}</div>
              </div>
            )}

            <div className="info-card">
              <div className="info-label">Oxidation States</div>
              <div className="info-value">{element.oxidationStates || 'N/A'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Discovery Year</div>
              <div className="info-value">{element.discoveryYear || 'N/A'}</div>
            </div>

            <div className="info-card" style={{ gridColumn: 'span 2' }}>
              <div className="info-label">Appearance</div>
              <div className="info-value">{element.appearance || 'N/A'}</div>
            </div>
            
            {!element.isCompound && (
              <div className="info-card" style={{ gridColumn: 'span 2' }}>
                <div className="info-label">Structure Details</div>
                <div className="info-value" style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Located in <strong>Period {element.period}</strong>, <strong>Group {element.group || 'N/A'}</strong>, and <strong>Block {element.block}</strong> of the Periodic Table.
                </div>
              </div>
            )}
          </div>

          {/* 3D Test Tube Model Visualization (Right Side) */}
          <div className="viz-panel">
            <h3 style={{ fontFamily: 'var(--font-display)', alignSelf: 'flex-start', fontSize: '1.2rem' }}>
              3D Test Tube State
            </h3>
            
            <div className="canvas-container">
              <TestTube3D element={element} />
              <div className="canvas-instruction">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Drag to rotate 3D model
              </div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Visual rendering represents the physical properties of{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>{element.name}</strong> under STP conditions.
            </div>

            {/* Quick-Load Actions for Reaction simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', marginTop: 'auto' }}>
                <button 
                  className="action-btn" 
                  style={{ 
                    padding: '0.6rem 1rem', 
                    fontSize: '0.82rem', 
                    width: '100%', 
                    justifyContent: 'center', 
                    margin: 0,
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    color: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    onClose()
                    navigate('/assistant', {
                      state: {
                        query: `Tell me about ${element.name} (${element.symbol}) - including atomic structure, electron configuration, typical reactions, and safety notes.`
                      }
                    })
                  }}
                >
                  <Bot size={15} style={{ color: 'var(--primary)' }} />
                  <span>Ask ChemBot AI about {element.name}</span>
                </button>

                {onLoadLeft && (
                  <button 
                    className="action-btn action-btn-primary" 
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center', margin: 0 }}
                    onClick={() => {
                      onLoadLeft(element)
                      onClose()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Load into Left Tube
                  </button>
                )}
                {onLoadRight && (
                  <button 
                    className="action-btn action-btn-secondary" 
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center', margin: 0 }}
                    onClick={() => {
                      onLoadRight(element)
                      onClose()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Load into Right Tube
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
