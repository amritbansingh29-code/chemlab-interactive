import React from 'react'
import { elements } from '../data/elements'

export default function PeriodicTable({ onSelectElement, activeElement, searchTerm, categoryFilter, stateFilter }) {
  // Helper to determine CSS Grid position
  const getGridPosition = (el) => {
    const num = el.atomicNumber
    
    // Lanthanides (57 - 71) -> Period 9 (columns 4 - 18)
    if (num >= 57 && num <= 71) {
      return {
        gridRow: 9,
        gridColumn: num - 57 + 4
      }
    }
    // Actinides (89 - 103) -> Period 10 (columns 4 - 18)
    if (num >= 89 && num <= 103) {
      return {
        gridRow: 10,
        gridColumn: num - 89 + 4
      }
    }
    
    return {
      gridRow: el.period,
      gridColumn: el.group
    }
  }

  // Filter elements based on search, category and state
  const isElementVisible = (el) => {
    const query = searchTerm.toLowerCase().trim()
    const nameMatch = el.name.toLowerCase().includes(query) || 
                      el.symbol.toLowerCase().includes(query) ||
                      el.atomicNumber.toString() === query
                      
    const categoryMatch = !categoryFilter || el.category === categoryFilter
    const stateMatch = !stateFilter || el.standardState === stateFilter
    
    return nameMatch && categoryMatch && stateMatch
  }

  const handleCellClick = (el) => {
    onSelectElement(el)
  }

  // Helper to choose element glass color
  const getElementColor = (el) => {
    if (!el) return '#64748b'
    const category = el.category || ''
    switch (category) {
      case 'Alkali metal': return '#f87171'
      case 'Alkaline earth metal': return '#fb923c'
      case 'Transition metal': return '#f59e0b'
      case 'Post-transition metal': return '#10b981'
      case 'Metalloid': return '#38bdf8'
      case 'Nonmetal': return '#60a5fa'
      case 'Halogen': return '#a78bfa'
      case 'Noble gas': return '#f472b6'
      case 'Lanthanide': return '#2dd4bf'
      case 'Actinide': return '#818cf8'
      case 'Chalcogen': return '#a855f7'
      default: return '#94a3b8'
    }
  }

  // Legend categories definition for display
  const categories = [
    { name: 'Alkali metal', label: 'Alkali Metals', color: 'var(--cat-alkali-metal)' },
    { name: 'Alkaline earth metal', label: 'Alkaline Earths', color: 'var(--cat-alkaline-earth-metal)' },
    { name: 'Transition metal', label: 'Transition Metals', color: 'var(--cat-transition-metal)' },
    { name: 'Post-transition metal', label: 'Post-Transition', color: 'var(--cat-post-transition-metal)' },
    { name: 'Metalloid', label: 'Metalloids', color: 'var(--cat-metalloid)' },
    { name: 'Nonmetal', label: 'Nonmetals', color: 'var(--cat-nonmetal)' },
    { name: 'Halogen', label: 'Halogens', color: 'var(--cat-halogen)' },
    { name: 'Noble gas', label: 'Noble Gases', color: 'var(--cat-noble-gas)' },
    { name: 'Lanthanide', label: 'Lanthanides', color: 'var(--cat-lanthanide)' },
    { name: 'Actinide', label: 'Actinides', color: 'var(--cat-actinide)' },
  ]

  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <div className="periodic-table-container">
        <div className="periodic-table">
          
          {/* Main 118 Elements rendering */}
          {elements.map((el) => {
            const pos = getGridPosition(el)
            const visible = isElementVisible(el)
            const isActive = activeElement && activeElement.atomicNumber === el.atomicNumber
            
            return (
              <div
                key={el.atomicNumber}
                className={`element-cell ${isActive ? 'active' : ''} ${!visible ? 'hidden' : ''}`}
                data-category={el.category}
                style={{
                  gridRow: pos.gridRow,
                  gridColumn: pos.gridColumn,
                  '--tube-color': getElementColor(el)
                }}
                onClick={() => handleCellClick(el)}
              >
                <div className="testtube-shell">
                  <div className="tube-neck"></div>
                  <div className="tube-body">
                    <div className="tube-liquid" />
                    <div className="tube-labels">
                      <span className="tube-number">{el.atomicNumber}</span>
                      <span className="tube-symbol">{el.symbol}</span>
                    </div>
                  </div>
                </div>
                <div className="element-cell-name">{el.name}</div>
              </div>
            )
          })}

          {/* Spacer between main grid and f-block */}
          <div className="periodic-row-spacer"></div>

          {/* Lanthanide series spacer indicator block at Row 6, Column 3 */}
          <div 
            className="element-cell" 
            style={{ 
              gridRow: 6, 
              gridColumn: 3, 
              borderColor: 'var(--cat-lanthanide)', 
              background: 'rgba(20, 184, 166, 0.05)',
              cursor: 'default'
            }}
          >
            <div className="element-cell-num" style={{ color: 'var(--cat-lanthanide)' }}>57-71</div>
            <div className="element-cell-symbol" style={{ fontSize: '0.9rem', color: 'var(--cat-lanthanide)' }}>La-Lu</div>
            <div className="element-cell-name" style={{ fontSize: '0.55rem' }}>Lanthanides</div>
          </div>

          {/* Actinide series spacer indicator block at Row 7, Column 3 */}
          <div 
            className="element-cell" 
            style={{ 
              gridRow: 7, 
              gridColumn: 3, 
              borderColor: 'var(--cat-actinide)', 
              background: 'rgba(99, 102, 241, 0.05)',
              cursor: 'default'
            }}
          >
            <div className="element-cell-num" style={{ color: 'var(--cat-actinide)' }}>89-103</div>
            <div className="element-cell-symbol" style={{ fontSize: '0.9rem', color: 'var(--cat-actinide)' }}>Ac-Lr</div>
            <div className="element-cell-name" style={{ fontSize: '0.55rem' }}>Actinides</div>
          </div>

          {/* Row Labels for bottom sections */}
          <div 
            style={{ 
              gridRow: 9, 
              gridColumn: 1, 
              gridColumnEnd: 'span 3',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              paddingRight: '1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Lanthanides
          </div>

          <div 
            style={{ 
              gridRow: 10, 
              gridColumn: 1, 
              gridColumnEnd: 'span 3',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              paddingRight: '1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Actinides
          </div>

        </div>
      </div>
      
      {/* Category Legend */}
      <div className="legend-container">
        {categories.map((cat) => (
          <div key={cat.name} className="legend-item">
            <span className="legend-color" style={{ '--leg-color': cat.color }}></span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
