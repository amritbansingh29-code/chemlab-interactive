import React from 'react'

export default function NeonAtom() {
  const pathD = "M 40,100 a 60,20 0 1,0 120,0 a 60,20 0 1,0 -120,0"

  return (
    <div className="neon-atom-container">
      {/* Radial neon glow background layer */}
      <div className="atom-glow-background" />

      <svg className="neon-atom-svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          {/* Radial gradient for central glow */}
          <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="1" />
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
          
          {/* Neon intense shadow glow filter */}
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer dotted rings with rotating dash arrays */}
        <circle cx="100" cy="100" r="84" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="3 9" fill="none" className="atom-dashed-ring" />
        <circle cx="100" cy="100" r="78" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5" strokeDasharray="30 180" fill="none" className="atom-dashed-ring-reverse" />
        
        {/* Orbit Group 1 (Horizontal - 0deg) */}
        <g transform="rotate(0 100 100)">
          <path d={pathD} stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" fill="none" filter="url(#neon-glow)" />
          <circle r="4" fill="#00f2fe" filter="url(#neon-glow)">
            <animateMotion dur="3.2s" repeatCount="indefinite" path={pathD} begin="0s" />
          </circle>
        </g>

        {/* Orbit Group 2 (60deg) */}
        <g transform="rotate(60 100 100)">
          <path d={pathD} stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" fill="none" filter="url(#neon-glow)" />
          <circle r="4" fill="#00f2fe" filter="url(#neon-glow)">
            <animateMotion dur="2.7s" repeatCount="indefinite" path={pathD} begin="-0.8s" />
          </circle>
        </g>

        {/* Orbit Group 3 (120deg) */}
        <g transform="rotate(120 100 100)">
          <path d={pathD} stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" fill="none" filter="url(#neon-glow)" />
          <circle r="4" fill="#00f2fe" filter="url(#neon-glow)">
            <animateMotion dur="3.5s" repeatCount="indefinite" path={pathD} begin="-1.6s" />
          </circle>
        </g>

        {/* Central glowing Nucleus */}
        <circle cx="100" cy="100" r="10" fill="url(#nucleus-glow)" filter="url(#neon-glow)" className="atom-nucleus" />
      </svg>
    </div>
  )
}
