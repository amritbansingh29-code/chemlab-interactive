import { useState } from 'react'
import ElementDetails from '../components/ElementDetails'
import PeriodicTable from '../components/PeriodicTable'
import { compounds } from '../data/compounds'
import TestTube3D from '../components/TestTube3D'

export default function ExplorePage({ selectedElement, setSelectedElement, onLoadLeft, onLoadRight }) {
  const [activeTab, setActiveTab] = useState('elements') // 'elements' or 'compounds'
  
  // Element filters
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')

  // Compound filters
  const [compSearchTerm, setCompSearchTerm] = useState('')
  const [compCategoryFilter, setCompCategoryFilter] = useState('')
  const [compStateFilter, setCompStateFilter] = useState('')

  const handleResetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStateFilter('')
  }

  const handleResetCompFilters = () => {
    setCompSearchTerm('')
    setCompCategoryFilter('')
    setCompStateFilter('')
  }

  // Filtered compounds list
  const filteredCompounds = compounds.filter(comp => {
    const termMatch = comp.name.toLowerCase().includes(compSearchTerm.toLowerCase()) || 
                      comp.symbol.toLowerCase().includes(compSearchTerm.toLowerCase())
    const catMatch = !compCategoryFilter || comp.category === compCategoryFilter
    const stateMatch = !compStateFilter || comp.standardState === compStateFilter
    return termMatch && catMatch && stateMatch
  })

  return (
    <div className="page-view explore-page">
      {/* Floating title block directly on background, matching the mockup */}
      <div className="explore-header-floating">
        <h1 className="explore-title">Interactive Chemistry Explorer</h1>
        <p className="explore-subtitle">
          Explore individual elements on the Periodic Table or analyze compound structures and properties.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="explore-tabs-container">
        <button 
          className={`explore-tab-btn ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
        >
          Elements (Periodic Table)
        </button>
        <button 
          className={`explore-tab-btn ${activeTab === 'compounds' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('compounds')
            setSelectedElement(null)
          }}
        >
          Chemical Compounds
        </button>
      </div>

      {activeTab === 'elements' ? (
        <section id="periodic-table-section">
          {/* Sleek transparent search and filters bar */}
          <div className="controls-bar-floating">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search elements by symbol, name, or atomic number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Nonmetal">Nonmetals</option>
                <option value="Noble gas">Noble Gases</option>
                <option value="Alkali metal">Alkali Metals</option>
                <option value="Alkaline earth metal">Alkaline Earths</option>
                <option value="Transition metal">Transition Metals</option>
                <option value="Post-transition metal">Post-Transition Metals</option>
                <option value="Metalloid">Metalloids</option>
                <option value="Halogen">Halogens</option>
                <option value="Lanthanide">Lanthanides</option>
                <option value="Actinide">Actinides</option>
              </select>

              <select
                className="filter-select"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="">All States (STP)</option>
                <option value="Solid">Solid</option>
                <option value="Liquid">Liquid</option>
                <option value="Gas">Gas</option>
              </select>

              {(searchTerm || categoryFilter || stateFilter) && (
                <button className="action-btn action-btn-secondary filter-clear-btn" onClick={handleResetFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <PeriodicTable
            onSelectElement={setSelectedElement}
            activeElement={selectedElement}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            stateFilter={stateFilter}
          />
        </section>
      ) : (
        <section id="compounds-section">
          {/* Compounds Search and Filters Bar */}
          <div className="controls-bar-floating">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search compounds by formula or name..."
                value={compSearchTerm}
                onChange={(e) => setCompSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={compCategoryFilter}
                onChange={(e) => setCompCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Acid">Acids</option>
                <option value="Base">Bases</option>
                <option value="Salt">Salts</option>
                <option value="Oxide">Oxides</option>
                <option value="Organic">Organic Compounds</option>
              </select>

              <select
                className="filter-select"
                value={compStateFilter}
                onChange={(e) => setCompStateFilter(e.target.value)}
              >
                <option value="">All States (STP)</option>
                <option value="Solid">Solid</option>
                <option value="Liquid">Liquid</option>
                <option value="Gas">Gas</option>
              </select>

              {(compSearchTerm || compCategoryFilter || compStateFilter) && (
                <button className="action-btn action-btn-secondary filter-clear-btn" onClick={handleResetCompFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Compounds Laboratory Rack Grid */}
          <div className="compounds-grid-rack">
            {filteredCompounds.map((comp) => {
              const badgeColor = comp.category === 'Acid' ? 'var(--cat-acid)' :
                                 comp.category === 'Base' ? 'var(--cat-base)' :
                                 comp.category === 'Salt' ? 'var(--cat-salt)' :
                                 comp.category === 'Oxide' ? 'var(--cat-oxide)' :
                                 'var(--cat-organic)';
              return (
                <div 
                  key={comp.atomicNumber} 
                  className="compound-rack-card glass-card"
                  onClick={() => setSelectedElement(comp)}
                >
                  <div className="compound-card-tube-area">
                    <TestTube3D element={comp} />
                  </div>
                  <div className="compound-card-info">
                    <span className="compound-card-symbol">{comp.symbol}</span>
                    <span className="compound-card-name">{comp.name}</span>
                    <span 
                      className="compound-card-category-tag"
                      style={{ color: badgeColor }}
                    >
                      {comp.category} • {comp.standardState}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredCompounds.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No compounds found matching the search filters.
              </div>
            )}
          </div>
        </section>
      )}

      {selectedElement && (
        <ElementDetails
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
          onLoadLeft={onLoadLeft}
          onLoadRight={onLoadRight}
        />
      )}
    </div>
  )
}
