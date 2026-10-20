import React, { useRef, useEffect, useState } from 'react'

export default function TestTube3D({ element, isPouring = false, tiltAngle = 0, pouringSide = 'left' }) {
  const canvasRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)
  
  // Custom element color & rendering type map based on physics
  const getElementProperties = (el) => {
    if (!el) return { color: '#6366f1', state: 'Solid', shiny: true }
    
    const category = el.category || ''
    const standardState = el.standardState || 'Solid'
    const name = el.name || ''
    
    let color = el.color || '#a1a1aa' // Default silver-gray
    let stateType = standardState // Gas, Liquid, Solid
    
    // Explicit color matching
    if (el.color) {
      color = el.color
    } else if (name === 'Hydrogen') color = '#e0f2fe'
    else if (name === 'Helium') color = '#ffedd5'
    else if (name === 'Neon') color = '#ffedd5'
    else if (name === 'Argon') color = '#ede9fe'
    else if (name === 'Krypton') color = '#dbeafe'
    else if (name === 'Xenon') color = '#dbeafe'
    else if (name === 'Fluorine') color = '#fef08a'
    else if (name === 'Chlorine') color = '#ccfbf1'
    else if (name === 'Oxygen') color = '#e0f2fe'
    else if (name === 'Nitrogen') color = '#dbeafe'
    else if (name === 'Bromine') color = '#7c2d12'
    else if (name === 'Mercury') color = '#cbd5e1'
    else if (name === 'Copper') color = '#ea580c'
    else if (name === 'Gold') color = '#fbbf24'
    else if (name === 'Sulfur') color = '#fef08a'
    else if (name === 'Carbon') color = '#1e293b'
    else if (name === 'Iodine') color = '#4c1d95'
    else if (name === 'Phosphorus') color = '#ef4444'
    else if (category.includes('Alkali')) color = '#f43f5e'
    else if (category.includes('Alkaline')) color = '#fb923c'
    else if (category.includes('Halogen')) color = '#c084fc'
    else if (category.includes('Noble')) color = '#f472b6'
    else if (category.includes('Lanthanide')) color = '#2dd4bf'
    else if (category.includes('Actinide')) color = '#818cf8'
    
    // Unstable elements are radioactive
    const isRadioactive = !el.isCompound && (el.atomicNumber >= 84 || el.atomicNumber === 43 || el.atomicNumber === 61)
    
    return {
      color,
      state: stateType,
      isRadioactive,
      category
    }
  }

  const props = getElementProperties(element)
  
  // Drag rotation handlers
  const handleMouseDown = (e) => {
    if (isPouring) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || isPouring) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setRotation(prev => ({
      x: Math.max(-0.5, Math.min(0.5, prev.x + dy * 0.005)),
      y: prev.y + dx * 0.005
    }))
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Animation and Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight
    
    let time = 0
    // Dynamic particles for Gas/Decay
    const particles = []
    const particleCount = props.state === 'Gas' || props.isRadioactive ? 30 : 0
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 160 + 20, // Inside tube height range
        z: (Math.random() - 0.5) * 40,
        speedY: (Math.random() * 0.5 + 0.2) * (props.state === 'Gas' ? 1 : -1),
        radius: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        speedRot: Math.random() * 0.02 + 0.01
      })
    }
    
    // Liquid bubbles (if boiling, e.g., low boiling point)
    const bubbles = []
    const isBoiling = props.state === 'Liquid' && element && parseFloat(element.boilingPoint) < 100
    
    const draw = () => {
      time += 0.03
      ctx.clearRect(0, 0, width, height)
      
      // Constants
      const centerX = width / 2
      const centerY = height / 2 - 20
      const tubeWidth = 54
      const tubeHeight = 190
      const rimRadius = 32
      
      // Calculate dynamic tilt angle
      let currentTilt = 0
      if (isPouring) {
        // Map dynamic tilt angle from parent page container
        currentTilt = tiltAngle * (pouringSide === 'left' ? 1 : -1)
      } else {
        currentTilt = rotation.y * 0.1 // Slight tilt based on drag
      }
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(currentTilt)
      
      // Draw 3D-effect back shadow of the tube
      ctx.beginPath()
      ctx.roundRect(-tubeWidth/2, -tubeHeight/2, tubeWidth, tubeHeight, [0, 0, tubeWidth/2, tubeWidth/2])
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fill()
      
      // Render Content: Solid, Liquid or Gas
      if (props.state === 'Liquid') {
        // Draw Liquid Level
        const liquidHeight = tubeHeight * 0.5 // Filled halfway
        const topY = tubeHeight/2 - liquidHeight
        
        ctx.save()
        // Clip content to tube boundaries
        ctx.beginPath()
        ctx.roundRect(-tubeWidth/2, -tubeHeight/2, tubeWidth, tubeHeight, [0, 0, tubeWidth/2, tubeWidth/2])
        ctx.clip()
        
        // Liquid Base Fill
        ctx.beginPath()
        ctx.roundRect(-tubeWidth/2, topY, tubeWidth, liquidHeight, [0, 0, tubeWidth/2, tubeWidth/2])
        const liquidGrad = ctx.createLinearGradient(-tubeWidth/2, topY, tubeWidth/2, tubeHeight/2)
        liquidGrad.addColorStop(0, props.color)
        liquidGrad.addColorStop(0.5, darkenColor(props.color, 20))
        liquidGrad.addColorStop(1, darkenColor(props.color, 40))
        ctx.fillStyle = liquidGrad
        ctx.fill()
        
        // Sloshing Wave Surface
        ctx.beginPath()
        ctx.moveTo(-tubeWidth/2 - 5, topY)
        // Add sloshing sine wave
        const sloshFreq = 0.1
        const sloshAmp = 4 + Math.sin(time * 2) * 1.5
        for (let x = -tubeWidth/2; x <= tubeWidth/2; x++) {
          const waveY = topY + Math.sin(x * sloshFreq + time * 3) * sloshAmp * (1 + Math.abs(currentTilt))
          ctx.lineTo(x, waveY)
        }
        ctx.lineTo(tubeWidth/2 + 5, tubeHeight/2)
        ctx.lineTo(-tubeWidth/2 - 5, tubeHeight/2)
        ctx.closePath()
        ctx.fillStyle = props.color
        ctx.fill()
        
        // Bubbles if boiling
        if (isBoiling || Math.random() < 0.1) {
          if (bubbles.length < 15) {
            bubbles.push({
              x: (Math.random() - 0.5) * (tubeWidth - 10),
              y: tubeHeight/2 - Math.random() * (liquidHeight - 10),
              size: Math.random() * 3 + 1,
              speed: Math.random() * 1 + 0.5
            })
          }
        }
        
        bubbles.forEach((b, idx) => {
          b.y -= b.speed
          // Check if popped at wave surface
          const topWave = topY + Math.sin(b.x * 0.1 + time * 3) * 4
          if (b.y < topWave) {
            bubbles.splice(idx, 1)
            return
          }
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
          ctx.fill()
        })
        
        ctx.restore()
      } 
      else if (props.state === 'Gas') {
        // Draw Gas Glow/Mist in Tube
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(-tubeWidth/2, -tubeHeight/2 + 20, tubeWidth, tubeHeight - 20, [0, 0, tubeWidth/2, tubeWidth/2])
        ctx.clip()
        
        const gasGrad = ctx.createLinearGradient(0, -tubeHeight/2 + 20, 0, tubeHeight/2)
        gasGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        gasGrad.addColorStop(0.5, hexToRgba(props.color, 0.25))
        gasGrad.addColorStop(1, hexToRgba(props.color, 0.5))
        ctx.fillStyle = gasGrad
        ctx.fill()
        
        // Animate particles in pseudo-3D
        particles.forEach(p => {
          p.angle += p.speedRot
          // Map x and z using rotation coordinates
          const projectedX = p.x * Math.cos(p.angle) - p.z * Math.sin(p.angle)
          const scale = 1 + (p.z * Math.sin(p.angle)) / 80 // Depth scale
          
          p.y -= p.speedY
          if (p.y < -tubeHeight/2 + 30) {
            p.y = tubeHeight/2 - 15
          }
          
          ctx.beginPath()
          ctx.arc(projectedX, p.y, p.radius * scale, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(props.color, 0.7 * scale)
          ctx.shadowBlur = 8
          ctx.shadowColor = props.color
          ctx.fill()
          ctx.shadowBlur = 0 // Reset shadow
        })
        
        ctx.restore()
      } 
      else if (props.state === 'Solid') {
        // Render Crystalline or Mineral Solid structures at the bottom
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(-tubeWidth/2, -tubeHeight/2, tubeWidth, tubeHeight, [0, 0, tubeWidth/2, tubeWidth/2])
        ctx.clip()
        
        // Draw small chunks / facets of crystal
        const solidHeight = 50
        const bottomY = tubeHeight / 2 - 10
        
        // Base fill for solid density
        ctx.beginPath()
        ctx.moveTo(-tubeWidth/2, bottomY)
        ctx.quadraticCurveTo(0, bottomY - solidHeight * 0.7, tubeWidth/2, bottomY)
        ctx.lineTo(tubeWidth/2, tubeHeight/2)
        ctx.lineTo(-tubeWidth/2, tubeHeight/2)
        ctx.closePath()
        ctx.fillStyle = darkenColor(props.color, 25)
        ctx.fill()
        
        // Render 8 crystals chunks in pseudo-3D
        const crystalPoints = [
          { x: -16, y: bottomY - 12, s: 14, r: 0.3 },
          { x: 14, y: bottomY - 10, s: 12, r: -0.4 },
          { x: -2, y: bottomY - 24, s: 16, r: 0.1 },
          { x: -12, y: bottomY - 6, s: 10, r: 0.5 },
          { x: 10, y: bottomY - 18, s: 15, r: -0.2 },
          { x: 0, y: bottomY - 4, s: 12, r: 0.8 }
        ]
        
        crystalPoints.forEach((cp, idx) => {
          ctx.save()
          ctx.translate(cp.x, cp.y)
          // Add drag rotation impact to make crystals feel slightly 3D
          ctx.rotate(cp.r + rotation.y * 0.4)
          
          // Draw faceted polygon
          ctx.beginPath()
          const size = cp.s
          ctx.moveTo(0, -size / 2)
          ctx.lineTo(size / 2, -size / 4)
          ctx.lineTo(size * 0.4, size / 3)
          ctx.lineTo(-size * 0.4, size / 3)
          ctx.lineTo(-size / 2, -size / 4)
          ctx.closePath()
          
          // Gradient shading to create crystal facets
          const facetGrad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2)
          facetGrad.addColorStop(0, lightenColor(props.color, idx * 8))
          facetGrad.addColorStop(0.5, props.color)
          facetGrad.addColorStop(1, darkenColor(props.color, 30))
          
          ctx.fillStyle = facetGrad
          ctx.strokeStyle = lightenColor(props.color, 35)
          ctx.lineWidth = 1
          ctx.fill()
          ctx.stroke()
          
          // Glare shine highlight
          ctx.beginPath()
          ctx.moveTo(-size/4, -size/3)
          ctx.lineTo(0, -size/4)
          ctx.lineTo(-size/6, 0)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
          ctx.fill()
          
          ctx.restore()
        })
        
        ctx.restore()
      }
      
      // Radioactive Decay Particles Glow
      if (props.isRadioactive) {
        ctx.save()
        // Draw concentric radioactive decay rings
        const ringCount = 2
        for (let rIdx = 0; rIdx < ringCount; rIdx++) {
          const ringRad = ((time * 30 + rIdx * 45) % 90) + 10
          const ringOpacity = Math.max(0, 1 - ringRad / 90)
          ctx.beginPath()
          ctx.arc(0, 0, ringRad, 0, Math.PI * 2)
          ctx.strokeStyle = hexToRgba(props.color, ringOpacity * 0.4)
          ctx.lineWidth = 1.5
          ctx.shadowBlur = 6
          ctx.shadowColor = props.color
          ctx.stroke()
        }
        
        // Bubbling radioactive sparks
        particles.forEach(p => {
          p.y += p.speedY * 1.5
          p.angle += 0.05
          const sparksX = p.x + Math.sin(p.angle) * 12
          if (p.y > tubeHeight / 2 - 10) p.y = -tubeHeight / 2 + 30
          
          ctx.beginPath()
          ctx.arc(sparksX, p.y, p.radius * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = '#fff'
          ctx.shadowBlur = 10
          ctx.shadowColor = props.color
          ctx.fill()
        })
        ctx.restore()
      }
      
      // DRAW GLASS TEST TUBE (FOREGROUND)
      ctx.beginPath()
      // Bottom curved semicircle, straight walls
      ctx.roundRect(-tubeWidth/2, -tubeHeight/2, tubeWidth, tubeHeight, [0, 0, tubeWidth/2, tubeWidth/2])
      
      // Outer glass thick boundary
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 2.5
      ctx.stroke()
      
      // Highlight glare reflecting on glass (Left)
      ctx.beginPath()
      ctx.moveTo(-tubeWidth/2 + 4, -tubeHeight/2 + 10)
      ctx.lineTo(-tubeWidth/2 + 4, tubeHeight/2 - 15)
      ctx.quadraticCurveTo(-tubeWidth/2 + 6, tubeHeight/2 - 6, 0, tubeHeight/2 - 4)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      // Bright glare spot (Right)
      ctx.beginPath()
      ctx.moveTo(tubeWidth/2 - 5, -tubeHeight/2 + 10)
      ctx.lineTo(tubeWidth/2 - 5, tubeHeight/2 - 18)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1.0
      ctx.stroke()
      
      // Rim lip at the top
      ctx.beginPath()
      ctx.ellipse(0, -tubeHeight/2, rimRadius, 6, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(22, 24, 38, 0.95)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Rim inner opening ellipse
      ctx.beginPath()
      ctx.ellipse(0, -tubeHeight/2, rimRadius - 4, 3, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(10, 11, 16, 0.9)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.restore()
      
      // Loop
      animationFrameRef.current = requestAnimationFrame(draw)
    }
    
    // Start drawing loop
    draw()
    
    // Handle window resizing
    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    })
    resizeObserver.observe(canvas)
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      resizeObserver.disconnect()
    }
  }, [element, rotation, isPouring, tiltAngle, pouringSide, props.color, props.state, props.isRadioactive])

  // Helpers for color manipulation
  function darkenColor(hex, percent) {
    hex = hex.replace('#', '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)
    
    r = Math.max(0, Math.floor(r * (1 - percent / 100)))
    g = Math.max(0, Math.floor(g * (1 - percent / 100)))
    b = Math.max(0, Math.floor(b * (1 - percent / 100)))
    
    return `rgb(${r}, ${g}, ${b})`
  }

  function lightenColor(hex, percent) {
    hex = hex.replace('#', '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)
    
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))
    
    return `rgb(${r}, ${g}, ${b})`
  }

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: '100%', height: '100%', cursor: isPouring ? 'default' : isDragging ? 'grabbing' : 'grab' }}
      />
    </div>
  )
}
