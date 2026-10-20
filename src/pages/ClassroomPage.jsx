import { useState } from 'react'
import { Play, Search, GraduationCap, Video, BookOpen, Info, FlaskConical } from 'lucide-react'
import { localVideos } from '../data/videos'

export default function ClassroomPage({ activeVideo, setActiveVideo }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter local videos based on search & category tab
  const filteredVideos = localVideos.filter(vid => {
    const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || vid.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const openVideo = (vid) => {
    setActiveVideo(vid)
  }

  const closeVideo = () => {
    setActiveVideo(null)
  }

  return (
    <div className="page-view explore-page">

      {/* Hero Header */}
      <section className="page-hero glass-card">
        <div className="hero-copy">
          <span className="hero-eyebrow">Interactive Classroom</span>
          <h1>Visual Learning Hub</h1>
          <p className="hero-description">
            Reinforce your practical knowledge. Browse our curated library of high-impact classroom videos and laboratory demonstrations downloaded directly to your system.
          </p>
        </div>
        <div className="hero-panel-small">
          <div className="hero-panel-item">
            <strong>10</strong>
            <span>Local Videos</span>
          </div>
          <div className="hero-panel-item">
            <strong>Offline</strong>
            <span>Ready</span>
          </div>
          <div className="hero-panel-item">
            <strong>1080p</strong>
            <span>High-Def Media</span>
          </div>
        </div>
      </section>

      {/* ============================================================
         📺 MAIN SECTION: LOCAL CLASSROOM VIDEO LIBRARY
         ============================================================ */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>

        {/* Section Header with Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: '#fff' }}>Classroom Video Library</h2>
          </div>

          {/* Search bar */}
          <div className="search-wrapper" style={{ margin: 0, width: '100%', maxWidth: '300px' }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search lectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.55rem 1rem 0.55rem 2.2rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['All', 'Core Concepts', 'Lab Experiments', 'Problem Solving'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeCategory === cat ? '0 4px 12px var(--primary-glow)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Card Grid */}
        <div className="video-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredVideos.map(vid => {
            const isAvailable = !!vid.title;
            return (
              <div
                key={vid.id}
                className={`video-card glass-card info-card ${!isAvailable ? 'video-card-disabled' : ''}`}
                onClick={() => isAvailable && openVideo(vid)}
                style={{ 
                  cursor: isAvailable ? 'pointer' : 'default', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: isAvailable ? 1 : 0.2,
                  pointerEvents: isAvailable ? 'auto' : 'none'
                }}
              >
              {/* Custom Styled Chemical Icon Thumbnail */}
              <div className="video-card-thumb" style={{
                height: '160px',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '12px 12px 0 0' }} />

                {/* Floating duration badge */}
                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  zIndex: 2
                }}>
                  {vid.duration}
                </span>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  zIndex: 2
                }}>
                  <FlaskConical size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '700', zIndex: 2 }}>
                  Chemistry Video
                </span>

                <div className="video-play-icon" style={{
                  background: 'var(--primary)',
                  boxShadow: '0 0 20px var(--primary-glow)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  zIndex: 3,
                  position: 'absolute',
                  transform: 'scale(0.8)',
                  opacity: 0,
                  transition: 'all 0.2s ease'
                }}>
                  <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                </div>
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>

                {/* Creator & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <span>{vid.creator}</span>
                  <span style={{ color: 'var(--cat-noble-gas)' }}>● {vid.views}</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', lineHeight: '1.4', margin: '0.25rem 0' }}>
                  {vid.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {vid.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', justifySelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {vid.category}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <BookOpen size={12} />
                    <span>Resource</span>
                  </span>
                </div>

              </div>
            </div>
          )})}

          {filteredVideos.length === 0 && (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No videos found matching your search. Try another keyword.
            </div>
          )}
        </div>

      </section>

      {/* ============================================================
         📺 VIDEO PLAYER MODAL FOR LOCAL VIDEOS
         ============================================================ */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={closeVideo} style={{ zIndex: 110 }}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
            <button className="video-modal-close" onClick={closeVideo} aria-label="Close video">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="video-modal-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', paddingRight: '2rem' }}>
              {activeVideo.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '600' }}>
              <span>Lecturer: {activeVideo.creator}</span>
              <span>•</span>
              <span>Availability: {activeVideo.views}</span>
              <span>•</span>
              <span style={{ color: 'var(--primary)' }}>Topic: {activeVideo.category}</span>
            </div>

            {/* Local Responsive Video Player */}
            <div className="video-modal-player" style={{ aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                src={activeVideo.videoPath}
                title={activeVideo.title}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginTop: '1rem' }}>
              <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.2rem' }}>Academic Synopsis</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
