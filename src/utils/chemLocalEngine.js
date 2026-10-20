import { elements } from '../data/elements.js'
import { compounds } from '../data/compounds.js'
import { chemistryQA } from '../data/chemistryQA.js'

// Periodic weights map
const ELEMENT_WEIGHTS = {}
elements.forEach(el => {
  const weight = parseFloat(el.atomicWeight.replace(/[()]/g, ''))
  ELEMENT_WEIGHTS[el.symbol] = isNaN(weight) ? 1.0 : weight
})

// Subscript formatter: converts numbers to unicode subscripts
export function formatSubscripts(str) {
  if (!str) return ''
  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '⁺', '-': '⁻'
  }
  return str.replace(/([A-Za-z)\]])(\d+)/g, (match, prefix, num) => {
    const sub = num.split('').map(d => subMap[d] || d).join('')
    return prefix + sub
  })
}

// Parse chemical formula including parentheses (e.g. Ca(OH)2, (NH4)2SO4, Fe2(SO4)3)
export function parseFormula(formula) {
  const counts = {}
  function parseSegment(str, multiplier = 1) {
    let clean = str.trim()
    const parenRegex = /\(([^()]+)\)(\d*)/
    let match
    while ((match = parenRegex.exec(clean)) !== null) {
      const inner = match[1]
      const count = match[2] ? parseInt(match[2], 10) : 1
      parseSegment(inner, multiplier * count)
      clean = clean.replace(match[0], '')
    }
    const elementRegex = /([A-Z][a-z]*)(\d*)/g
    let elMatch
    while ((elMatch = elementRegex.exec(clean)) !== null) {
      const el = elMatch[1]
      const count = elMatch[2] ? parseInt(elMatch[2], 10) : 1
      if (el) {
        counts[el] = (counts[el] || 0) + (count * multiplier)
      }
    }
  }
  parseSegment(formula)
  return counts
}

// 1. Molar Mass & Stoichiometry Engine
export function calculateMolarMass(formula) {
  try {
    const cleanFormula = formula.trim().replace(/^molar mass of\s+/i, '').replace(/^molecular weight of\s+/i, '').replace(/[?.,!]/g, '')
    const counts = parseFormula(cleanFormula)
    const elementKeys = Object.keys(counts)
    
    if (elementKeys.length === 0) return null

    let totalMass = 0
    const breakdown = []

    for (const sym of elementKeys) {
      const weight = ELEMENT_WEIGHTS[sym]
      if (weight === undefined) {
        // Unknown element symbol
        return null
      }
      const count = counts[sym]
      const partMass = weight * count
      totalMass += partMass
      breakdown.push({
        symbol: sym,
        name: elements.find(e => e.symbol === sym)?.name || sym,
        count,
        atomicWeight: weight.toFixed(3),
        totalMass: partMass
      })
    }

    const formattedFormula = formatSubscripts(cleanFormula)
    let md = `### ⚖️ Molar Mass Analysis: **${formattedFormula}**\n\n`
    md += `The total molecular weight (molar mass) of **${formattedFormula}** is **${totalMass.toFixed(3)} g/mol**.\n\n`
    md += `| Element | Atomic Mass | Count | Subtotal (g/mol) | Mass Percent (%) |\n`
    md += `| :--- | :--- | :--- | :--- | :--- |\n`

    breakdown.forEach(item => {
      const percent = ((item.totalMass / totalMass) * 100).toFixed(2)
      md += `| **${item.name} (${item.symbol})** | ${item.atomicWeight} | ${item.count} | ${item.totalMass.toFixed(3)} | **${percent}%** |\n`
    })

    md += `\n**Stoichiometry Quick Reference:**\n`
    md += `- $1\\text{ mole of } ${cleanFormula} = ${totalMass.toFixed(2)}\\text{ grams}$\n`
    md += `- Contains $6.022 \\times 10^{23}$ formula units (Avogadro's constant).\n`

    return {
      success: true,
      molarMass: totalMass,
      formattedMarkdown: md,
      breakdown
    }
  } catch {
    return null
  }
}

// 2. Chemical Equation Balancer Engine
export function balanceEquation(equationStr) {
  try {
    const cleanEq = equationStr
      .replace(/^balance[:\s]*/i, '')
      .replace(/->|→|==>|=>/g, '=')
      .replace(/[?]/g, '')
      .trim()

    const sides = cleanEq.split('=')
    if (sides.length !== 2) return null

    const leftParts = sides[0].split('+').map(s => s.trim().replace(/^\d+/, '')).filter(Boolean)
    const rightParts = sides[1].split('+').map(s => s.trim().replace(/^\d+/, '')).filter(Boolean)

    if (leftParts.length === 0 || rightParts.length === 0) return null

    const leftParsed = leftParts.map(f => parseFormula(f))
    const rightParsed = rightParts.map(f => parseFormula(f))

    // Collect all elements
    const allElements = new Set()
    ;[...leftParsed, ...rightParsed].forEach(p => {
      Object.keys(p).forEach(el => allElements.add(el))
    })
    const elementsList = Array.from(allElements)

    const nL = leftParts.length
    const nR = rightParts.length
    const total = nL + nR

    const maxCoeff = 14

    function checkCoeffs(coeffs) {
      for (const el of elementsList) {
        let lCount = 0
        for (let i = 0; i < nL; i++) {
          lCount += (leftParsed[i][el] || 0) * coeffs[i]
        }
        let rCount = 0
        for (let i = 0; i < nR; i++) {
          rCount += (rightParsed[i][el] || 0) * coeffs[nL + i]
        }
        if (lCount !== rCount) return false
      }
      return true
    }

    let solution = null
    const current = new Array(total).fill(1)

    function solve(idx) {
      if (solution) return
      if (idx === total) {
        if (checkCoeffs(current)) {
          solution = [...current]
        }
        return
      }
      for (let c = 1; c <= maxCoeff; c++) {
        current[idx] = c
        solve(idx + 1)
        if (solution) return
      }
    }

    for (let c0 = 1; c0 <= 8; c0++) {
      current[0] = c0
      solve(1)
      if (solution) break
    }

    if (!solution) return null

    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }
    const commonGcd = solution.reduce((acc, val) => gcd(acc, val))
    const finalCoeffs = solution.map(v => v / commonGcd)

    const leftFormatted = leftParts.map((p, idx) => {
      const c = finalCoeffs[idx]
      return `${c > 1 ? c : ''}${formatSubscripts(p)}`
    }).join(' + ')

    const rightFormatted = rightParts.map((p, idx) => {
      const c = finalCoeffs[nL + idx]
      return `${c > 1 ? c : ''}${formatSubscripts(p)}`
    }).join(' + ')

    const balancedEq = `${leftFormatted} → ${rightFormatted}`

    // Classify reaction type
    let reactionType = 'Chemical Reaction'
    if (nL >= 2 && nR === 1) reactionType = 'Combination / Synthesis Reaction'
    else if (nL === 1 && nR >= 2) reactionType = 'Decomposition Reaction'
    else if (sides[0].includes('O2') && (sides[1].includes('CO2') || sides[1].includes('H2O'))) reactionType = 'Combustion Reaction'
    else if (nL === 2 && nR === 2) reactionType = 'Displacement / Metathesis Reaction'

    let md = `### ⚖️ Balanced Chemical Equation\n\n`
    md += `$$\\mathbf{${leftFormatted} \\longrightarrow ${rightFormatted}}$$\n\n`
    md += `**Reaction Classification:** ${reactionType}\n\n`
    md += `**Verification of Conservation of Mass:**\n`
    md += `| Element | Reactants (Left) | Products (Right) | Balanced? |\n`
    md += `| :--- | :---: | :---: | :---: |\n`

    elementsList.forEach(el => {
      let lCount = 0
      for (let i = 0; i < nL; i++) lCount += (leftParsed[i][el] || 0) * finalCoeffs[i]
      let rCount = 0
      for (let i = 0; i < nR; i++) rCount += (rightParsed[i][el] || 0) * finalCoeffs[nL + i]
      md += `| **${el}** | ${lCount} | ${rCount} | ✅ Balanced |\n`
    })

    md += `\n*The stoichiometric coefficients ensure identical numbers of each atomic species exist before and after the reaction in compliance with Lavoisier's Law of Conservation of Mass.*`

    return {
      success: true,
      balancedEquation: balancedEq,
      formattedMarkdown: md,
      leftParts,
      rightParts
    }
  } catch {
    return null
  }
}

// 3. Chemical Entity Lookup (Elements & Compounds)
export function lookupChemicalEntity(query) {
  const q = query.trim().toLowerCase()
  
  // Check exact symbol match
  let foundEl = elements.find(e => e.symbol.toLowerCase() === q || e.name.toLowerCase() === q)
  
  // Check words inside query
  if (!foundEl) {
    foundEl = elements.find(e => {
      const nameMatch = q.includes(e.name.toLowerCase())
      const symRegex = new RegExp(`\\b${e.symbol.toLowerCase()}\\b`, 'i')
      return nameMatch || (e.symbol.length > 1 && symRegex.test(q))
    })
  }

  // Check compounds
  let foundComp = compounds.find(c => c.symbol.toLowerCase() === q || c.name.toLowerCase() === q)
  if (!foundComp) {
    foundComp = compounds.find(c => {
      const nameMatch = q.includes(c.name.toLowerCase())
      const symMatch = q.includes(c.symbol.toLowerCase())
      return nameMatch || symMatch
    })
  }

  if (foundEl) {
    let md = `### ⚛️ Element Profile: **${foundEl.name} (${foundEl.symbol})**\n\n`
    md += `| Property | Value |\n`
    md += `| :--- | :--- |\n`
    md += `| **Atomic Number** | ${foundEl.atomicNumber} |\n`
    md += `| **Atomic Weight** | ${foundEl.atomicWeight} g/mol |\n`
    md += `| **Category** | ${foundEl.category} |\n`
    md += `| **Group, Period, Block** | Group ${foundEl.group || 'N/A'}, Period ${foundEl.period}, ${foundEl.block}-block |\n`
    md += `| **Electron Configuration** | ${foundEl.electronConfiguration} |\n`
    md += `| **Electronegativity** | ${foundEl.electronegativity} |\n`
    md += `| **Oxidation States** | ${foundEl.oxidationStates} |\n`
    md += `| **Standard State (STP)** | ${foundEl.standardState} |\n`
    md += `| **Appearance** | ${foundEl.appearance} |\n`
    md += `| **Melting / Boiling Point** | ${foundEl.meltingPoint} / ${foundEl.boilingPoint} |\n`
    md += `| **Discovery Year** | ${foundEl.discoveryYear} |\n\n`
    md += `*Would you like to examine its orbital state in the 3D Element Explorer or test its reactivity in the Virtual Lab?*`

    return {
      type: 'element',
      entity: foundEl,
      formattedMarkdown: md,
      actions: [
        { label: `🔍 View ${foundEl.name} in 3D Explorer`, type: 'explore', symbol: foundEl.symbol },
        { label: `⚡ Load ${foundEl.symbol} into Lab`, type: 'lab', left: foundEl.symbol, right: 'H2O' }
      ]
    }
  }

  if (foundComp) {
    let md = `### 🧪 Chemical Compound: **${foundComp.name} (${formatSubscripts(foundComp.symbol)})**\n\n`
    md += `| Property | Value |\n`
    md += `| :--- | :--- |\n`
    md += `| **Chemical Formula** | **${formatSubscripts(foundComp.symbol)}** |\n`
    md += `| **Category** | ${foundComp.category} |\n`
    md += `| **Molar Mass** | ${foundComp.atomicWeight} g/mol |\n`
    md += `| **Standard State** | ${foundComp.standardState} |\n`
    md += `| **Density** | ${foundComp.density} |\n`
    md += `| **Melting / Boiling** | ${foundComp.meltingPoint} / ${foundComp.boilingPoint} |\n`
    md += `| **Appearance** | ${foundComp.appearance} |\n\n`
    md += `*You can load ${foundComp.name} into the reaction bench or inspect it in the Explorer.*`

    return {
      type: 'compound',
      entity: foundComp,
      formattedMarkdown: md,
      actions: [
        { label: `⚡ Test ${foundComp.symbol} in Virtual Lab`, type: 'lab', left: foundComp.symbol, right: 'NaOH' },
        { label: `🔍 Inspect in Explorer`, type: 'explore', symbol: foundComp.symbol }
      ]
    }
  }

  return null
}

// 4. Lab Safety Advisor
export function getSafetyAdvice(query) {
  const q = query.toLowerCase()
  if (q.includes('acid') && (q.includes('water') || q.includes('dilut') || q.includes('mix') || q.includes('pour'))) {
    return {
      title: '🛡️ Critical Safety Rule: Acid Dilution Protocol',
      markdown: `### 🛡️ Lab Safety: Always Add Acid to Water (AA)\n\n` +
        `> **Golden Chemistry Rule:** **"Always Add Acid to Water, never water to acid."** (Remember: **AA** = Add Acid!)\n\n` +
        `**Scientific Reason:**\n` +
        `Hydration of strong concentrated acids (like $\\text{H}_2\\text{SO}_4$ or $\\text{HCl}$) is an **extremely exothermic process** (releases immense heat energy).\n\n` +
        `- **If water is poured into concentrated acid:** The initial drops of water turn to steam instantaneously. Because water is less dense than acid, it stays on the surface, boils violently, and sprays concentrated corrosive acid into the air and onto your skin/eyes!\n` +
        `- **If acid is poured slowly into water:** Water has a very high specific heat capacity. The large volume of water absorbs the released heat safely with continuous stirring.\n\n` +
        `**PPE Requirements:**\n` +
        `1. Chemical splash goggles.\n` +
        `2. Nitrile or neoprene gloves.\n` +
        `3. Lab coat and close-toed shoes.\n` +
        `4. Work under a certified fume hood.`
    }
  }

  if (q.includes('bunsen') || q.includes('burner') || q.includes('heating') || q.includes('heat tube')) {
    return {
      title: '🔥 Safe Bunsen Burner & Test Tube Heating',
      markdown: `### 🔥 Bunsen Burner & Heating Procedures\n\n` +
        `**1. Heating a Test Tube Safely:**\n` +
        `- **Angle:** Hold the test tube at a $45^\\circ$ angle using a metal test tube holder.\n` +
        `- **Orientation:** **NEVER point the open mouth of the test tube towards yourself or any classmate!** Sudden boiling ("bumping") can eject boiling liquids violently.\n` +
        `- **Movement:** Move the tube back and forth through the flame continuously to distribute heat evenly and prevent thermal shock cracking.\n` +
        `- **Liquid Level:** Never fill a test tube more than $1/3$ full when heating.\n\n` +
        `**2. Flame Regulation:**\n` +
        `- **Yellow Safety Flame:** Air hole fully closed (luminous, cooler, sooty).\n` +
        `- **Blue Heating Flame:** Air hole opened (non-luminous, hottest at the cone tip $\\sim 1500^\\circ\\text{C}$).`
    }
  }

  if (q.includes('smell') || q.includes('odor') || q.includes('waft') || q.includes('vapor')) {
    return {
      title: '👃 Safe Vapor Detection: The Wafting Technique',
      markdown: `### 👃 How to Safely Smell Chemicals: Wafting\n\n` +
        `> **Rule:** **NEVER inhale directly from the mouth of a container or beaker.**\n\n` +
        `**The Wafting Technique:**\n` +
        `1. Hold the vessel approximately $15 - 20\\text{ cm}$ away from your nose.\n` +
        `2. Use your cupped hand to gently fan the vapors toward your face.\n` +
        `3. Take shallow breaths through the nose while waving vapors toward you.\n\n` +
        `**Danger:** Direct inhalation of vapors like $\\text{Cl}_2$, $\\text{NH}_3$, or concentrated $\\text{HCl}$ can cause chemical burns to respiratory mucous membranes, pulmonary edema, and sudden asphyxiation.`
    }
  }

  if (q.includes('spill') || q.includes('emergency') || q.includes('fire') || q.includes('nfpa')) {
    return {
      title: '🚨 Chemical Spill & Emergency Response',
      markdown: `### 🚨 Emergency Response Protocols\n\n` +
        `1. **Acid Spills:** Neutralize with a weak base such as **Sodium Bicarbonate** (Baking Soda, $\\text{NaHCO}_3$) until fizzing ceases, then wipe with absorbent pads.\n` +
        `2. **Base Spills:** Neutralize with a weak acid like dilute acetic acid (vinegar) or boric acid.\n` +
        `3. **Skin Contact:** Immediately flush affected skin under emergency eyewash/shower for **at least 15 continuous minutes**. Remove contaminated clothing.\n` +
        `4. **NFPA 704 Diamond:**\n` +
        `   - **Blue (Left):** Health Hazard (0 = Normal, 4 = Deadly)\n` +
        `   - **Red (Top):** Flammability (Flash points)\n` +
        `   - **Yellow (Right):** Instability/Reactivity\n` +
        `   - **White (Bottom):** Special Hazards ($\\mathbf{W}$ with slash = Water reactive, $\\text{OX}$ = Oxidizer).`
    }
  }

  return null
}

// 5. Semantic Matcher across Chemistry QA
export function findBestQAMatch(query) {
  const cleanQ = query.toLowerCase().replace(/[?.,!]/g, '')
  const queryTokens = cleanQ.split(/\s+/).filter(t => t.length > 2)

  let bestMatch = null
  let highestScore = 0

  chemistryQA.forEach(item => {
    const itemQ = item.q.toLowerCase()
    let score = 0

    // Exact or phrase inclusion
    if (itemQ.includes(cleanQ) || cleanQ.includes(itemQ)) {
      score += 50
    }

    // Token matching
    queryTokens.forEach(token => {
      if (itemQ.includes(token)) score += 5
      if (item.a.toLowerCase().includes(token)) score += 1
    })

    if (score > highestScore) {
      highestScore = score
      bestMatch = item
    }
  })

  // Require minimum match confidence
  if (highestScore >= 10 && bestMatch) {
    return {
      match: bestMatch,
      confidence: highestScore
    }
  }
  return null
}

// 6. Main Local Chemistry Intelligence Engine
export function queryLocalChemEngine(query) {
  const q = query.trim()
  const lowerQ = q.toLowerCase()

  // 1. Balance Equation Check
  if (
    lowerQ.includes('balance') || 
    lowerQ.includes('->') || 
    lowerQ.includes('→') || 
    (lowerQ.includes('+') && lowerQ.includes('='))
  ) {
    const balanced = balanceEquation(q)
    if (balanced) {
      return {
        text: balanced.formattedMarkdown,
        category: 'Equation Balancer',
        actions: []
      }
    }
  }

  // 2. Molar Mass Check
  if (
    lowerQ.includes('molar mass') || 
    lowerQ.includes('molecular weight') || 
    lowerQ.includes('molecular mass') || 
    lowerQ.includes('formula weight') ||
    lowerQ.startsWith('mass of ')
  ) {
    const molar = calculateMolarMass(q)
    if (molar) {
      return {
        text: molar.formattedMarkdown,
        category: 'Stoichiometry & Molar Mass',
        actions: []
      }
    }
  }

  // 3. Safety Advice Check
  const safety = getSafetyAdvice(q)
  if (safety) {
    return {
      text: safety.markdown,
      category: 'Lab Safety Guidelines',
      actions: [
        { label: '🛡️ Open Safety Guidelines', type: 'classroom' }
      ]
    }
  }

  // 4. Preloaded Deep QA Database Search
  const qaMatch = findBestQAMatch(q)
  if (qaMatch) {
    return {
      text: qaMatch.match.a,
      category: 'Curated Chemistry QA',
      actions: []
    }
  }

  // 5. Element & Compound Lookup
  const entity = lookupChemicalEntity(q)
  if (entity) {
    return {
      text: entity.formattedMarkdown,
      category: entity.type === 'element' ? 'Periodic Elements' : 'Chemical Compounds',
      actions: entity.actions
    }
  }

  // 6. Chemical Reaction Intent (e.g. "what happens when you mix Na and H2O")
  if (lowerQ.includes('mix') || lowerQ.includes('react') || lowerQ.includes('combine') || lowerQ.includes('add')) {
    // Try to extract two reactants
    const matchedReactants = []
    const all = [...elements, ...compounds]
    
    all.forEach(item => {
      const symRegex = new RegExp(`\\b${item.symbol}\\b`, 'i')
      const nameRegex = new RegExp(`\\b${item.name}\\b`, 'i')
      if (symRegex.test(q) || nameRegex.test(q)) {
        if (!matchedReactants.some(r => r.symbol === item.symbol)) {
          matchedReactants.push(item)
        }
      }
    })

    if (matchedReactants.length >= 2) {
      const r1 = matchedReactants[0]
      const r2 = matchedReactants[1]
      return {
        text: `### 🧪 Chemical Reaction Analysis: **${r1.name} + ${r2.name}**\n\n` +
          `You are asking about combining **${r1.name} (${r1.symbol})** with **${r2.name} (${r2.symbol})**.\n\n` +
          `- **Reactant 1:** ${r1.name} (${r1.symbol}) — *${r1.category || 'Element'}*\n` +
          `- **Reactant 2:** ${r2.name} (${r2.symbol}) — *${r2.category || 'Element'}*\n\n` +
          `You can simulate this exact combination on the **Virtual Lab Reaction Bench** to observe the reaction rate, thermal curve, color changes, and precipitate formation!`,
        category: 'Reaction Simulation',
        actions: [
          { label: `⚡ Test ${r1.symbol} + ${r2.symbol} in Virtual Lab`, type: 'lab', left: r1.symbol, right: r2.symbol },
          { label: `🔍 Explore ${r1.name}`, type: 'explore', symbol: r1.symbol }
        ]
      }
    }
  }

  // Fallback intelligent chemistry guide response
  return {
    text: `### 🧪 ChemBot Chemistry AI Assistant\n\n` +
      `I can help you with comprehensive chemistry topics across all laboratory disciplines! Here are some things you can try:\n\n` +
      `- **Equation Balancing:** Type \`Balance C3H8 + O2 -> CO2 + H2O\` or \`Fe + O2 -> Fe2O3\`\n` +
      `- **Molar Mass Calculator:** Type \`Molar mass of H2SO4\` or \`Molecular weight of Ca(OH)2\`\n` +
      `- **Element & Compound Dossier:** Type \`Tell me about Titanium\` or \`Properties of Gold\`\n` +
      `- **Lab Safety Protocols:** Ask about \`Safe procedure for heating test tubes\` or \`Acid dilution rule\`\n` +
      `- **Reaction Bench Simulations:** Ask \`What happens when Na is added to H2O?\` or \`HCl + NaOH\`\n\n` +
      `*Feel free to ask any specific chemistry question or click one of the quick suggestions!*`,
    category: 'General Chemistry Help',
    actions: []
  }
}
