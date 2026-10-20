import React, { useRef, useEffect } from 'react'

export default function Beaker({ leftElement, rightElement, reactionProgress, isReacting, isCompleted = false, reactionType, resultColor }) {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight
    
    let time = 0
    // Reaction animations arrays
    const bubbles = []
    const sparks = []
    const smoke = []
    const precipitates = []
    
    const draw = () => {
      time += 0.04
      ctx.clearRect(0, 0, width, height)
      
      const centerX = width / 2
      const centerY = height / 2 + 30
      const beakerW = 100
      const beakerH = 120
      
      // Determine liquid volume & colors based on pouring progress
      let fillHeight = 0
      let liquidColor = 'rgba(255, 255, 255, 0.05)' // Clear empty
      
      const leftCol = getElementColor(leftElement)
      const rightCol = getElementColor(rightElement)
      
      // Reaction progress states:
      // Phase 1 (0 to 0.5): Pouring. Liquid fills up.
      // Phase 2 (0.5 to 1.0): Reacting. Beaker bubbles/flashes and changes color.
      
      if (isReacting || isCompleted) {
        if (isCompleted || reactionProgress >= 1.0) {
          // Filled and settled to final product state
          fillHeight = beakerH * 0.45
          liquidColor = resultColor || '#3b82f6'
        } else if (reactionProgress < 0.5) {
          // Fill rises up to 40% full
          fillHeight = (reactionProgress / 0.5) * (beakerH * 0.45)
          // Mix colors based on progress
          liquidColor = mixHexColors(leftCol, rightCol, reactionProgress * 2)
        } else {
          // Filled to 45% and reacting/reactants merged
          fillHeight = beakerH * 0.45
          const factor = (reactionProgress - 0.5) / 0.5
          // Transition to the computed final reaction product color!
          liquidColor = mixHexColors(rightCol, resultColor || '#3b82f6', factor)
        }
      } else if (leftElement || rightElement) {
        // Just selected, empty beaker or slightly loaded with base elements
        fillHeight = 0
        liquidColor = 'rgba(255, 255, 255, 0.05)'
      }

      ctx.save()
      
      // 1. DRAW POURING STREAMS (0.0 to 0.5 progress)
      if (isReacting && reactionProgress < 0.5) {
        const streamProgress = reactionProgress / 0.5
        
        // Left Stream (from Left Test Tube station)
        if (leftElement) {
          ctx.beginPath()
          ctx.moveTo(centerX - 100, centerY - beakerH + 10)
          ctx.quadraticCurveTo(
            centerX - 60, centerY - beakerH + 10,
            centerX - beakerW * 0.25, centerY - fillHeight + 5
          )
          ctx.strokeStyle = leftCol
          ctx.lineWidth = 4 * (1 - streamProgress * 0.2)
          ctx.stroke()
          
          // Splashes
          if (Math.random() < 0.3) {
            ctx.beginPath()
            ctx.arc(centerX - beakerW * 0.25, centerY - fillHeight + 5, 3, 0, Math.PI * 2)
            ctx.fillStyle = leftCol
            ctx.fill()
          }
        }
        
        // Right Stream (from Right Test Tube station)
        if (rightElement) {
          ctx.beginPath()
          ctx.moveTo(centerX + 100, centerY - beakerH + 10)
          ctx.quadraticCurveTo(
            centerX + 60, centerY - beakerH + 10,
            centerX + beakerW * 0.25, centerY - fillHeight + 5
          )
          ctx.strokeStyle = rightCol
          ctx.lineWidth = 4 * (1 - streamProgress * 0.2)
          ctx.stroke()
          
          // Splashes
          if (Math.random() < 0.3) {
            ctx.beginPath()
            ctx.arc(centerX + beakerW * 0.25, centerY - fillHeight + 5, 3, 0, Math.PI * 2)
            ctx.fillStyle = rightCol
            ctx.fill()
          }
        }
      }

      // 2. LIQUID SURFACE AND FILL INSIDE BEAKER
      if (fillHeight > 0) {
        ctx.save()
        // Clip content to Beaker inside dimensions
        ctx.beginPath()
        ctx.roundRect(centerX - beakerW/2 + 3, centerY - beakerH + 6, beakerW - 6, beakerH - 8, [0, 0, 8, 8])
        ctx.clip()
        
        const liquidTopY = centerY - fillHeight
        
        // Liquid body
        ctx.beginPath()
        ctx.roundRect(centerX - beakerW/2, liquidTopY, beakerW, fillHeight + 10, [0, 0, 8, 8])
        
        const fillGrad = ctx.createLinearGradient(centerX, liquidTopY, centerX, centerY)
        fillGrad.addColorStop(0, liquidColor)
        fillGrad.addColorStop(1, darkenColor(liquidColor, 40))
        ctx.fillStyle = fillGrad
        ctx.fill()
        
        // Liquid wavy surface
        ctx.beginPath()
        ctx.moveTo(centerX - beakerW/2 - 2, liquidTopY)
        const waveFreq = 0.15
        const waveAmp = isReacting && reactionProgress >= 0.5 ? 4 : 2
        for (let x = centerX - beakerW/2; x <= centerX + beakerW/2; x++) {
          const waveY = liquidTopY + Math.sin(x * waveFreq + time * 5) * waveAmp
          ctx.lineTo(x, waveY)
        }
        ctx.lineTo(centerX + beakerW/2 + 2, centerY)
        ctx.lineTo(centerX - beakerW/2 - 2, centerY)
        ctx.closePath()
        ctx.fillStyle = liquidColor
        ctx.fill()
        
        // 3. REACTION ACTIVE PARTICLES (In beaker liquid)
        if (isReacting && reactionProgress >= 0.5) {
          const intensity = reactionProgress - 0.5 // 0.0 to 0.5
          
          // Bubbles (for vigorous reaction, acid/base, alkali metals)
          if (reactionType !== 'none') {
            const maxBubbles = reactionType === 'explosive' ? 40 : reactionType === 'fast' ? 25 : 10
            if (bubbles.length < maxBubbles && Math.random() < 0.4) {
              bubbles.push({
                x: centerX - beakerW/2 + 10 + Math.random() * (beakerW - 20),
                y: centerY - 10,
                radius: Math.random() * 3 + 1,
                speedY: Math.random() * 2 + 1,
                color: reactionType === 'explosive' ? '#ff7e00' : '#ffffff'
              })
            }
          }
          
          // Precipitation crystals (if reaction settles)
          if (reactionType === 'moderate' || reactionType === 'slow') {
            if (precipitates.length < 15 && Math.random() < 0.15) {
              precipitates.push({
                x: centerX - beakerW/2 + 15 + Math.random() * (beakerW - 30),
                y: centerY - fillHeight + 10,
                radius: Math.random() * 2 + 1,
                speedY: Math.random() * 0.5 + 0.3
              })
            }
          }
        }
        
        // Animate/Draw bubbles
        bubbles.forEach((b, idx) => {
          b.y -= b.speedY
          if (b.y < liquidTopY) {
            bubbles.splice(idx, 1)
            return
          }
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
          ctx.fillStyle = b.color
          ctx.globalAlpha = 0.6
          ctx.fill()
          ctx.globalAlpha = 1
        })
        
        // Animate/Draw Precipitate Crystals
        precipitates.forEach((p, idx) => {
          p.y += p.speedY
          if (p.y >= centerY - 8) {
            p.y = centerY - 8 // Settle at bottom
          }
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = lightenColor(liquidColor, 50)
          ctx.fill()
        })
        
        ctx.restore()
      }
      
      // 4. BEAKER GLASS SHELL
      ctx.beginPath()
      // Bottom flat corner rounding, top beaker lip
      ctx.roundRect(centerX - beakerW/2, centerY - beakerH, beakerW, beakerH, [0, 0, 8, 8])
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Beaker lip rims
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - beakerH, beakerW/2 + 4, 4, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Reflection glare
      ctx.beginPath()
      ctx.moveTo(centerX - beakerW/2 + 6, centerY - beakerH + 12)
      ctx.lineTo(centerX - beakerW/2 + 6, centerY - 12)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      // 5. EXTERIOR EFFECTS (Rising Smoke & Sparks)
      if (isReacting && reactionProgress >= 0.5) {
        const liquidTopY = centerY - fillHeight
        
        // Generate Sparks for Explosions/Combustions
        if (reactionType === 'explosive' && Math.random() < 0.5) {
          for (let sIdx = 0; sIdx < 5; sIdx++) {
            sparks.push({
              x: centerX,
              y: liquidTopY,
              vx: (Math.random() - 0.5) * 8,
              vy: -Math.random() * 8 - 2,
              life: 1.0,
              decay: Math.random() * 0.05 + 0.03
            })
          }
        }
        
        // Generate Smoke
        if ((reactionType === 'explosive' || reactionType === 'fast' || reactionType === 'moderate') && Math.random() < 0.25) {
          smoke.push({
            x: centerX + (Math.random() - 0.5) * (beakerW - 10),
            y: centerY - beakerH - 5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.5 - 0.5,
            radius: Math.random() * 8 + 4,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.015,
            color: reactionType === 'explosive' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.2)'
          })
        }
      }
      
      // Animate/Draw Sparks
      sparks.forEach((sp, idx) => {
        sp.x += sp.vx
        sp.y += sp.vy
        sp.vy += 0.2 // Gravity
        sp.life -= sp.decay
        
        if (sp.life <= 0) {
          sparks.splice(idx, 1)
          return
        }
        
        ctx.beginPath()
        ctx.moveTo(sp.x, sp.y)
        ctx.lineTo(sp.x - sp.vx, sp.y - sp.vy)
        ctx.strokeStyle = `rgba(251, 191, 36, ${sp.life})`
        ctx.lineWidth = 2
        ctx.shadowBlur = 10
        ctx.shadowColor = '#fbbf24'
        ctx.stroke()
        ctx.shadowBlur = 0
      })
      
      // Animate/Draw Smoke puffs
      smoke.forEach((sm, idx) => {
        sm.x += sm.vx
        sm.y += sm.vy
        sm.radius += 0.2
        sm.life -= sm.decay
        
        if (sm.life <= 0) {
          smoke.splice(idx, 1)
          return
        }
        
        ctx.beginPath()
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2)
        ctx.fillStyle = sm.color
        ctx.globalAlpha = sm.life
        ctx.fill()
        ctx.globalAlpha = 1
      })
      
      // Draw explosive flash in beaker (Kaboom effect overlay)
      if (isReacting && reactionType === 'explosive' && reactionProgress > 0.55 && reactionProgress < 0.75) {
        ctx.beginPath()
        ctx.arc(centerX, centerY - beakerH/2, beakerW * 0.8, 0, Math.PI * 2)
        const flashGrad = ctx.createRadialGradient(centerX, centerY - beakerH/2, 5, centerX, centerY - beakerH/2, beakerW * 0.8)
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        flashGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.8)')
        flashGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.3)')
        flashGrad.addColorStop(1, 'rgba(239, 68, 68, 0)')
        ctx.fillStyle = flashGrad
        ctx.fill()
      }
      
      ctx.restore()
      
      animationFrameRef.current = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [leftElement, rightElement, isReacting, isCompleted, reactionProgress, reactionType, resultColor])

  // Elements state colors
  function getElementColor(el) {
    if (!el) return '#3b82f6'
    if (el.color) return el.color
    
    const name = el.name
    if (name === 'Hydrogen') return '#e0f2fe'
    if (name === 'Oxygen') return '#93c5fd'
    if (name === 'Chlorine') return '#86efac'
    if (name === 'Bromine') return '#7c2d12'
    if (name === 'Mercury') return '#94a3b8'
    if (name === 'Sodium' || name === 'Lithium' || name === 'Potassium') return '#f43f5e'
    if (name === 'Gold') return '#fbbf24'
    if (name === 'Copper') return '#ea580c'
    if (name === 'Sulfur') return '#fde047'
    if (name === 'Carbon') return '#334155'
    if (name === 'Iodine') return '#a855f7'
    
    return '#64748b'
  }

  function mixHexColors(c1, c2, balance) {
    if (c1.startsWith('rgba')) return c1
    if (c2.startsWith('rgba')) return c2
    
    const parseColor = (c) => {
      if (c.startsWith('rgb')) {
        const match = c.match(/\d+/g)
        if (match) {
          return {
            r: parseInt(match[0]),
            g: parseInt(match[1]),
            b: parseInt(match[2])
          }
        }
      }
      const hex = c.replace('#', '')
      return {
        r: parseInt(hex.substring(0, 2), 16) || 0,
        g: parseInt(hex.substring(2, 4), 16) || 0,
        b: parseInt(hex.substring(4, 6), 16) || 0
      }
    }
    
    const p1 = parseColor(c1)
    const p2 = parseColor(c2)
    
    const r = Math.floor(p1.r * (1 - balance) + p2.r * balance)
    const g = Math.floor(p1.g * (1 - balance) + p2.g * balance)
    const b = Math.floor(p1.b * (1 - balance) + p2.b * balance)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  function darkenColor(rgbStr, percent) {
    if (!rgbStr.startsWith('rgb')) return rgbStr
    const match = rgbStr.match(/\d+/g)
    if (!match) return rgbStr
    
    let r = parseInt(match[0])
    let g = parseInt(match[1])
    let b = parseInt(match[2])
    
    r = Math.max(0, Math.floor(r * (1 - percent / 100)))
    g = Math.max(0, Math.floor(g * (1 - percent / 100)))
    b = Math.max(0, Math.floor(b * (1 - percent / 100)))
    
    return `rgb(${r}, ${g}, ${b})`
  }

  function lightenColor(rgbStr, percent) {
    if (!rgbStr.startsWith('rgb')) return rgbStr
    const match = rgbStr.match(/\d+/g)
    if (!match) return rgbStr
    
    let r = parseInt(match[0])
    let g = parseInt(match[1])
    let b = parseInt(match[2])
    
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))
    
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
