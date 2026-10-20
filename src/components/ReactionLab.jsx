import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'

import { elements } from '../data/elements'
import { compounds } from '../data/compounds'
import Beaker from './Beaker'
import TestTube3D from './TestTube3D'

const reactants = [...elements, ...compounds]


export default function ReactionLab({ leftEl: propLeftEl, setLeftEl: propSetLeftEl, rightEl: propRightEl, setRightEl: propSetRightEl }) {
  const navigate = useNavigate()
  const [localLeftEl, localSetLeftEl] = useState(null)
  const [localRightEl, localSetRightEl] = useState(null)
  
  const leftEl = propLeftEl !== undefined ? propLeftEl : localLeftEl
  const setLeftEl = propSetLeftEl || localSetLeftEl
  
  const rightEl = propRightEl !== undefined ? propRightEl : localRightEl
  const setRightEl = propSetRightEl || localSetRightEl
  
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [selectorSide, setSelectorSide] = useState('left') // 'left' or 'right'
  const [filterCategory, setFilterCategory] = useState('')
  const [reactantTypeFilter, setReactantTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Reacting animation states
  const [isReacting, setIsReacting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [reactionProgress, setReactionProgress] = useState(0)
  const [reactionData, setReactionData] = useState(null)
  
  // Custom tilt animation angles for test tubes
  const [tiltAngle, setTiltAngle] = useState(0)

  // Chemical Reaction Logic Engine
  const analyzeReaction = (el1, el2) => {
    if (!el1 || !el2) return null
    
    // Sort elements by atomic number to simplify matching pairs
    const [first, second] = el1.atomicNumber <= el2.atomicNumber ? [el1, el2] : [el2, el1]
    const s1 = first.symbol
    const s2 = second.symbol
    
    // 1. Same Element
    if (first.atomicNumber === second.atomicNumber) {
      return {
        reactive: false,
        reactionType: 'none',
        title: `Homogeneous Mixture of ${first.name}`,
        equation: `${first.symbol} + ${second.symbol} \u2192 ${first.symbol} (mixture)`,
        description: `Mixing an element with itself results in no chemical reaction. The atoms mix physically but remain structurally identical.`,
        color: getElementColorHex(first),
        tempChange: 'None'
      }
    }
    
    // === COMPOUND-COMPOUND REACTIONS ===
    
    // HCl + NaOH -> NaCl + H2O (Acid-Base Neutralization)
    if (s1 === 'HCl' && s2 === 'NaOH') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Base Neutralization',
        equation: 'HCl + NaOH \u2192 NaCl + H\u2082O',
        description: 'A classic neutralization reaction. The hydrochloric acid reacts with the sodium hydroxide base to produce sodium chloride (table salt) and water. The reaction is highly exothermic, releasing heat energy.',
        color: '#ffffff',
        tempChange: 'Exothermic (Vigorous)'
      }
    }
    
    // NaOH + H2SO4 -> Na2SO4 + H2O
    if (s1 === 'NaOH' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Base Neutralization',
        equation: 'H\u2082SO\u2084 + 2NaOH \u2192 Na\u2082SO\u2084 + 2H\u2082O',
        description: 'A vigorous neutralization reaction between strong sulfuric acid and strong sodium hydroxide base to yield soluble sodium sulfate salt and water.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Highly)'
      }
    }
    
    // NaOH + HNO3 -> NaNO3 + H2O
    if (s1 === 'NaOH' && s2 === 'HNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Base Neutralization',
        equation: 'HNO\u2083 + NaOH \u2192 NaNO\u2083 + H\u2082O',
        description: 'A neutralization reaction where strong nitric acid is neutralized by sodium hydroxide base, forming sodium nitrate and water.',
        color: '#f1f5f9',
        tempChange: 'Exothermic'
      }
    }
    
    // HCl + Ca(OH)2 -> CaCl2 + H2O
    if (s1 === 'HCl' && s2 === 'Ca(OH)2') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Neutralization of Calcium Hydroxide',
        equation: '2HCl + Ca(OH)\u2082 \u2192 CaCl\u2082 + 2H\u2082O',
        description: 'Hydrochloric acid reacts with slaked lime (calcium hydroxide), forming calcium chloride salt and water while dissolving the white suspension.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }
    
    // NH3 + HNO3 -> NH4NO3
    if (s1 === 'NH3' && s2 === 'HNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Synthesis of Ammonium Nitrate',
        equation: 'NH\u2083 + HNO\u2083 \u2192 NH\u2084NO\u2083',
        description: 'Gaseous ammonia reacts with concentrated nitric acid to produce ammonium nitrate. This reaction is extremely exothermic and produces thick white fumes of ammonium nitrate aerosol.',
        color: '#ffffff',
        tempChange: 'Exothermic (Highly)'
      }
    }
    
    // HCl + CaCO3 -> CaCl2 + H2O + CO2 (Acid + Carbonate)
    if (s1 === 'HCl' && s2 === 'CaCO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Carbonate Carbon Dioxide Evolution',
        equation: '2HCl + CaCO\u2083 \u2192 CaCl\u2082 + H\u2082O + CO\u2082\u2191',
        description: 'Calcium carbonate (chalk/limestone) dissolves vigorously in hydrochloric acid, producing soluble calcium chloride, water, and rapid effervescence of carbon dioxide gas bubbles.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Bubbling)'
      }
    }
    
    // CaCO3 + HNO3 -> Ca(NO3)2 + H2O + CO2
    if (s1 === 'CaCO3' && s2 === 'HNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Carbonate Reaction',
        equation: '2HNO\u2083 + CaCO\u2083 \u2192 Ca(NO\u2083)\u2082 + H\u2082O + CO\u2082\u2191',
        description: 'Calcium carbonate reacts with nitric acid to release carbon dioxide gas bubbles, leaving calcium nitrate salt and water in solution.',
        color: '#f1f5f9',
        tempChange: 'Exothermic'
      }
    }

    // CaCO3 + H2SO4 -> CaSO4 + H2O + CO2
    if (s1 === 'CaCO3' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Acid-Carbonate Precipitation',
        equation: 'CaCO\u2083 + H\u2082SO\u2084 \u2192 CaSO\u2084\u2193 + H\u2082O + CO\u2082\u2191',
        description: 'Sulfuric acid reacts with calcium carbonate, producing carbon dioxide gas bubbles and calcium sulfate, which forms a sparingly soluble white precipitate.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }
    
    // NaCl + AgNO3 -> AgCl + NaNO3 (Double Displacement Precipitation)
    if (s1 === 'NaCl' && s2 === 'AgNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Silver Chloride Precipitation',
        equation: 'NaCl + AgNO\u2083 \u2192 AgCl\u2193 + NaNO\u2083',
        description: 'When clear solutions of sodium chloride and silver nitrate are mixed, a double displacement reaction occurs. Insoluble white silver chloride precipitate forms instantly, turning the solution cloudy.',
        color: '#ffffff',
        tempChange: 'None'
      }
    }
    
    // HCl + AgNO3 -> AgCl + HNO3
    if (s1 === 'HCl' && s2 === 'AgNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Silver Chloride Acidic Precipitation',
        equation: 'HCl + AgNO\u2083 \u2192 AgCl\u2193 + HNO\u2083',
        description: 'Hydrochloric acid reacts with silver nitrate to precipitate insoluble white silver chloride, leaving nitric acid in the solution.',
        color: '#ffffff',
        tempChange: 'None'
      }
    }

    // HCl + CuO -> CuCl2 + H2O (Metal Oxide + Acid)
    if (s1 === 'HCl' && s2 === 'CuO') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Acid-Base Neutralization of Copper Oxide',
        equation: 'CuO + 2HCl \u2192 CuCl\u2082 + H\u2082O',
        description: 'Black copper(II) oxide solid dissolves in hydrochloric acid to form a beautiful blue-green solution of copper(II) chloride and water.',
        color: '#0d9488',
        tempChange: 'Exothermic'
      }
    }

    // H2SO4 + CuO -> CuSO4 + H2O
    if (s1 === 'H2SO4' && s2 === 'CuO') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Acid-Base Neutralization of Copper Oxide',
        equation: 'CuO + H\u2082SO\u2084 \u2192 CuSO\u2084 + H\u2082O',
        description: 'Solid black copper(II) oxide dissolves in sulfuric acid to form a vibrant blue copper(II) sulfate solution.',
        color: '#2563eb',
        tempChange: 'Exothermic'
      }
    }

    // HCl + MgO -> MgCl2 + H2O
    if (s1 === 'HCl' && s2 === 'MgO') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Neutralization of Magnesium Oxide',
        equation: 'MgO + 2HCl \u2192 MgCl\u2082 + H\u2082O',
        description: 'White magnesium oxide solid dissolves in hydrochloric acid, forming a clear solution of magnesium chloride and water.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // HCl + CaO -> CaCl2 + H2O
    if (s1 === 'HCl' && s2 === 'CaO') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Neutralization of Calcium Oxide',
        equation: 'CaO + 2HCl \u2192 CaCl\u2082 + H\u2082O',
        description: 'Calcium oxide reacts rapidly with hydrochloric acid to produce calcium chloride and water, releasing substantial heat.',
        color: '#ffffff',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // H2O + CaO -> Ca(OH)2 (Oxide Hydration)
    if (s1 === 'H2O' && s2 === 'CaO') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Slaking of Lime (Quicklime Hydration)',
        equation: 'CaO + H\u2082O \u2192 Ca(OH)\u2082',
        description: 'Calcium oxide (quicklime) reacts highly exothermically with water to form calcium hydroxide (slaked lime) as a cloudy white suspension. The thermal output is enough to boil water.',
        color: '#f8fafc',
        tempChange: 'Exothermic (Intense)'
      }
    }

    // H2O + MgO -> Mg(OH)2
    if (s1 === 'H2O' && s2 === 'MgO') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Hydration of Magnesium Oxide',
        equation: 'MgO + H\u2082O \u2192 Mg(OH)\u2082',
        description: 'Magnesium oxide reacts slowly with water to produce magnesium hydroxide, forming a basic suspension.',
        color: '#ffffff',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // AgNO3 + KI -> AgI + KNO3 (Silver Iodide Precipitation)
    if (s1 === 'AgNO3' && s2 === 'KI') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Silver Iodide Precipitation',
        equation: 'AgNO\u2083 + KI \u2192 AgI\u2193 + KNO\u2083',
        description: 'Mixing silver nitrate and potassium iodide yields a double displacement reaction where a pale yellow precipitate of silver iodide (AgI) instantly forms.',
        color: '#fef08a',
        tempChange: 'None'
      }
    }

    // KI + Pb(NO3)2 -> PbI2 + 2KNO3 (Golden Rain)
    if (s1 === 'KI' && s2 === 'Pb(NO3)2') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Golden Rain (Lead Iodide Precipitation)',
        equation: 'Pb(NO\u2083)\u2082 + 2KI \u2192 PbI\u2082\u2193 + 2KNO\u2083',
        description: 'A spectacular precipitation reaction. The mixing of clear lead(II) nitrate and potassium iodide solutions instantly forms a brilliant, golden-yellow precipitate of lead(II) iodide. When heated and cooled, it crystallizes as shimmering gold flakes.',
        color: '#eab308',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // H2SO4 + KI -> KHSO4 + HI (Concentrated acid oxidation)
    if (s1 === 'H2SO4' && s2 === 'KI') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Oxidative Decomposition of Potassium Iodide',
        equation: '2KI + 2H\u2082SO\u2084 \u2192 K\u2082SO\u2084 + SO\u2082\u2191 + I\u2082\u2191 + 2H\u2082O',
        description: 'Concentrated sulfuric acid reacts with solid potassium iodide, oxidizing the iodide ions to elemental iodine. This produces dense, beautiful violet/purple fumes of iodine gas along with sulfur dioxide gas.',
        color: '#86198f',
        tempChange: 'Exothermic'
      }
    }

    // HCl + NaHCO3 -> NaCl + H2O + CO2 (Baking Soda & Acid)
    if (s1 === 'HCl' && s2 === 'NaHCO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Acid-Carbonate Gas Evolution',
        equation: 'NaHCO\u2083 + HCl \u2192 NaCl + H\u2082O + CO\u2082\u2191',
        description: 'Vigorous acid-base reaction. The bicarbonate ion reacts with hydrochloric acid, rapidly decomposing to evolve large volumes of carbon dioxide gas bubbles in active effervescence, leaving a clear sodium chloride solution.',
        color: '#f1f5f9',
        tempChange: 'Endothermic (Mild Cooling)'
      }
    }

    // H2SO4 + NaHCO3 -> Na2SO4 + H2O + CO2
    if (s1 === 'H2SO4' && s2 === 'NaHCO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Sulfuric Acid & Bicarbonate Effervescence',
        equation: '2NaHCO\u2083 + H\u2082SO\u2084 \u2192 Na\u2082SO\u2084 + 2H\u2082O + 2CO\u2082\u2191',
        description: 'Sulfuric acid reacts vigorously with sodium bicarbonate powder, producing rapid fizzing and bubble evolution of carbon dioxide gas.',
        color: '#ffffff',
        tempChange: 'Endothermic (Mild)'
      }
    }

    // HNO3 + NaHCO3 -> NaNO3 + H2O + CO2
    if (s1 === 'HNO3' && s2 === 'NaHCO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Nitric Acid & Bicarbonate Reaction',
        equation: 'NaHCO\u2083 + HNO\u2083 \u2192 NaNO\u2083 + H\u2082O + CO\u2082\u2191',
        description: 'Nitric acid decomposes sodium bicarbonate rapidly with a strong release of carbon dioxide gas bubbles.',
        color: '#fef9c3',
        tempChange: 'Endothermic (Mild)'
      }
    }

    // NaOH + NaHCO3 -> Na2CO3 + H2O
    if (s1 === 'NaOH' && s2 === 'NaHCO3') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Bicarbonate Deprotonation',
        equation: 'NaHCO\u2083 + NaOH \u2192 Na\u2082CO\u2083 + H\u2082O',
        description: 'Sodium hydroxide deprotonates sodium bicarbonate to form highly soluble sodium carbonate and water. The solution remains clear with no visible precipitate, but a mild temperature increase occurs.',
        color: '#ffffff',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // NaOH + FeCl3 -> Fe(OH)3 + 3NaCl (Iron Hydroxide Precipitate)
    if (s1 === 'NaOH' && s2 === 'FeCl3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Iron(III) Hydroxide Precipitation',
        equation: 'FeCl\u2083 + 3NaOH \u2192 Fe(OH)\u2083\u2193 + 3NaCl',
        description: 'Double displacement reaction. The sodium hydroxide reacts with the iron(III) chloride solution, resulting in the instant precipitation of a gelatinous, reddish-brown iron(III) hydroxide solid.',
        color: '#78350f',
        tempChange: 'None'
      }
    }

    // NH3 + FeCl3 -> Fe(OH)3 + 3NH4Cl
    if (s1 === 'NH3' && s2 === 'FeCl3') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Ammonia Iron Precipitation',
        equation: 'FeCl\u2083 + 3NH\u2083 + 3H\u2082O \u2192 Fe(OH)\u2083\u2193 + 3NH\u2084Cl',
        description: 'Aqueous ammonia acts as a weak base, generating hydroxide ions that react with iron(III) ions to precipitate gelatinous reddish-brown iron(III) hydroxide.',
        color: '#78350f',
        tempChange: 'None'
      }
    }

    // AgNO3 + FeCl3 -> 3AgCl + Fe(NO3)3
    if (s1 === 'AgNO3' && s2 === 'FeCl3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Silver Chloride Precipitation in Brown Matrix',
        equation: '3AgNO\u2083 + FeCl\u2083 \u2192 3AgCl\u2193 + Fe(NO\u2083)\u2083',
        description: 'The chloride ions from iron(III) chloride react with silver ions from silver nitrate, instantly precipitating insoluble white silver chloride. The remaining solution is tinted yellow-brown by the iron(III) nitrate.',
        color: '#cbd5e1',
        tempChange: 'None'
      }
    }

    // H2O + KMnO4 -> KMnO4 (aq) (Permanganate Dissolution)
    if (s1 === 'H2O' && s2 === 'KMnO4') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Dissolution of Potassium Permanganate',
        equation: 'KMnO\u2084 (s) + H\u2082O (l) \u2192 KMnO\u2084 (aq)',
        description: 'Potassium permanganate crystals dissolve in water, spreading a beautiful, highly intense deep magenta/purple color throughout the solution. This is a physical dissolution process with a very high color absorption coefficient.',
        color: '#86198f',
        tempChange: 'None (Slightly Endothermic)'
      }
    }

    // C2H5OH + KMnO4 -> Ethanol Oxidation
    if (s1 === 'C2H5OH' && s2 === 'KMnO4') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Permanganate Oxidation of Ethanol',
        equation: '3CH\u2083CH\u2082OH + 4KMnO\u2084 \u2192 3CH\u2083COOH + 4MnO\u2082\u2193 + 4KOH + H\u2082O',
        description: 'The powerful oxidizing agent potassium permanganate oxidizes ethanol. The beautiful purple color of the permanganate solution is slowly reduced, yielding a dark brown precipitate of manganese dioxide (MnO2) or a decolorized solution if acidic.',
        color: '#78350f',
        tempChange: 'Exothermic'
      }
    }

    // H2O2 + KMnO4 -> Reduction of KMnO4 with O2 evolution
    if (s1 === 'H2O2' && s2 === 'KMnO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Redox Deactivation of Permanganate',
        equation: '2KMnO\u2084 + 3H\u2082O\u2082 \u2192 2MnO\u2082\u2193 + 2KOH + 3O\u2082\u2191 + 2H\u2082O',
        description: 'A vigorous redox reaction. Potassium permanganate oxidizes hydrogen peroxide, resulting in the rapid evolution of oxygen gas bubbles, and the purple color disappears, replaced by a brown manganese dioxide precipitate.',
        color: '#78350f',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // NaOH + CuSO4 -> Cu(OH)2 + Na2SO4 (Copper Hydroxide Precipitate)
    if (s1 === 'NaOH' && s2 === 'CuSO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Copper(II) Hydroxide Precipitation',
        equation: 'CuSO\u2084 + 2NaOH \u2192 Cu(OH)\u2082\u2193 + Na\u2082SO\u2084',
        description: 'Double displacement reaction. The sodium hydroxide base reacts with the blue copper(II) sulfate solution, instantly precipitating a gelatinous, bright sky-blue copper(II) hydroxide solid.',
        color: '#60a5fa',
        tempChange: 'None'
      }
    }

    // CuSO4 + NH3 -> Tetraamminecopper(II) Complex (Deep Blue)
    if (s1 === 'CuSO4' && s2 === 'NH3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Tetraamminecopper(II) Complexation',
        equation: 'CuSO\u2084 + 4NH\u2083 \u2192 [Cu(NH\u2083)\u2084]SO\u2084',
        description: 'A beautiful coordination chemistry demonstration. Ammonia initially forms a pale blue precipitate of copper hydroxide, which immediately redissolves in excess ammonia to yield a stunning, intense deep royal blue tetraamminecopper(II) complex solution.',
        color: '#1e3a8a',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // CuSO4 + KI -> CuI + I2 (Reduction/Oxidation)
    if (s1 === 'CuSO4' && s2 === 'KI') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Copper-Iodide Redox Precipitation',
        equation: '2CuSO\u2084 + 4KI \u2192 2CuI\u2193 + I\u2082 + 2K\u2082SO\u2084',
        description: 'An interesting redox reaction. Copper(II) oxidizes iodide to elemental iodine, while itself being reduced to copper(I). This forms a brown mixture containing insoluble off-white copper(I) iodide precipitate suspended in a dark brown triiodide solution.',
        color: '#7c2d12',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // HCl + FeS -> FeCl2 + H2S (Iron Sulfide Acid Dissolution)
    if (s1 === 'HCl' && s2 === 'FeS') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Acid Dissolution of Iron Sulfide',
        equation: 'FeS + 2HCl \u2192 FeCl\u2082 + H\u2082S\u2191',
        description: 'Black solid iron(II) sulfide reacts and dissolves in hydrochloric acid, producing bubbles of highly toxic hydrogen sulfide gas, which has a notorious odor of rotten eggs, and leaving a pale green iron(II) chloride solution.',
        color: '#86efac',
        tempChange: 'Exothermic'
      }
    }

    // FeS + H2SO4 -> FeSO4 + H2S
    if (s1 === 'FeS' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Iron Sulfide Acidic Dissolution',
        equation: 'FeS + H\u2082SO\u2084 \u2192 FeSO\u2084 + H\u2082S\u2191',
        description: 'Sulfuric acid reacts with black solid iron sulfide lumps, generating gaseous hydrogen sulfide with its rotten egg smell, and forming a light green solution of iron(II) sulfate.',
        color: '#86efac',
        tempChange: 'Exothermic'
      }
    }

    // HCl + ZnS -> ZnCl2 + H2S
    if (s1 === 'HCl' && s2 === 'ZnS') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Zinc Sulfide Acidic Dissolution',
        equation: 'ZnS + 2HCl \u2192 ZnCl\u2082 + H\u2082S\u2191',
        description: 'Hydrochloric acid reacts with white-yellow zinc sulfide powder, dissolving it to form a clear zinc chloride solution and release hydrogen sulfide gas.',
        color: '#f1f5f9',
        tempChange: 'Exothermic'
      }
    }

    // H2SO4 + ZnS -> ZnSO4 + H2S
    if (s1 === 'H2SO4' && s2 === 'ZnS') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Zinc Sulfide Sulfuric Acid Dissolution',
        equation: 'ZnS + H\u2082SO\u2084 \u2192 ZnSO\u2084 + H\u2082S\u2191',
        description: 'Sulfuric acid dissolves zinc sulfide powder, generating hydrogen sulfide gas bubbles and leaving a clear zinc sulfate solution.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // CO2 + Ca(OH)2 -> CaCO3 + H2O (Limewater turning milky)
    if (s1 === 'CO2' && s2 === 'Ca(OH)2') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Limewater Test (Carbon Dioxide Detection)',
        equation: 'Ca(OH)\u2082 + CO\u2082 \u2192 CaCO\u2083\u2193 + H\u2082O',
        description: 'The classic chemical test for carbon dioxide gas. When CO2 gas is bubbled into a clear solution of calcium hydroxide (limewater), it reacts to precipitate insoluble white calcium carbonate, turning the solution characteristically milky/cloudy.',
        color: '#ffffff',
        tempChange: 'None'
      }
    }

    // CO2 + NaOH -> Na2CO3 + H2O (Carbon Dioxide Absorption)
    if (s1 === 'CO2' && s2 === 'NaOH') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Carbon Dioxide Scrubbing',
        equation: '2NaOH + CO\u2082 \u2192 Na\u2082CO\u2083 + H\u2082O',
        description: 'Sodium hydroxide solution acts as a scrubber, absorbing carbon dioxide gas from the atmosphere or test tube to form highly soluble sodium carbonate salt and water.',
        color: '#f8fafc',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // HCl + NH3 -> NH4Cl (Ammonium Chloride Smoke)
    if (s1 === 'HCl' && s2 === 'NH3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Synthesis of Ammonium Chloride Smoke',
        equation: 'NH\u2083 + HCl \u2192 NH\u2084Cl',
        description: 'A spectacular gas-phase reaction. When volatile fumes of hydrochloric acid and ammonia gas meet, they combine directly to form a dense, opaque white cloud of solid ammonium chloride micro-crystals (appearing as thick white smoke).',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // === ELEMENT-COMPOUND REACTIONS ===

    // Na + H2O -> NaOH + H2 (Alkali Metal + Water)
    if (s1 === 'Na' && s2 === 'H2O') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Sodium Reaction with Water',
        equation: '2Na + 2H\u2082O \u2192 2NaOH + H\u2082\u2191',
        description: 'Sodium metal reacts violently with water. It melts into a sphere, skitters across the water surface releasing hydrogen, and ignites with an orange flame, leaving a basic sodium hydroxide solution.',
        color: '#fef9c3',
        tempChange: 'Exothermic (Extreme)'
      }
    }

    // K + H2O -> KOH + H2
    if (s1 === 'K' && s2 === 'H2O') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Potassium Reaction with Water',
        equation: '2K + 2H\u2082O \u2192 2KOH + H\u2082\u2191',
        description: 'Potassium reacts even more violently than sodium, immediately bursting into lilac/violet flames on contact with water and producing basic potassium hydroxide solution.',
        color: '#f3e8ff',
        tempChange: 'Exothermic (Extreme)'
      }
    }

    // Li + H2O -> LiOH + H2
    if (s1 === 'Li' && s2 === 'H2O') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Lithium Reaction with Water',
        equation: '2Li + 2H\u2082O \u2192 2LiOH + H\u2082\u2191',
        description: 'Lithium metal reacts vigorously with water, fizzing and releasing hydrogen gas as it dissolves into basic lithium hydroxide.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Highly)'
      }
    }

    // Ca + H2O -> Ca(OH)2 + H2
    if (s1 === 'Ca' && s2 === 'H2O') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Calcium Reaction with Water',
        equation: 'Ca + 2H\u2082O \u2192 Ca(OH)\u2082 + H\u2082\u2191',
        description: 'Calcium metal sinks in water and reacts steadily, generating hydrogen gas bubbles and forming a cloudy white suspension of calcium hydroxide.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // Mg + HCl -> MgCl2 + H2 (Metal + Acid Displacement)
    if (s1 === 'Mg' && s2 === 'HCl') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Magnesium and Hydrochloric Acid',
        equation: 'Mg + 2HCl \u2192 MgCl\u2082 + H\u2082\u2191',
        description: 'Magnesium metal dissolves rapidly in hydrochloric acid, producing calcium-clear magnesium chloride solution and bubbling hydrogen gas.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Mg + H2SO4 -> MgSO4 + H2
    if (s1 === 'Mg' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Magnesium and Sulfuric Acid',
        equation: 'Mg + H\u2082SO\u2084 \u2192 MgSO\u2084 + H\u2082\u2191',
        description: 'Magnesium reacts vigorously with sulfuric acid, forming magnesium sulfate and evolving hydrogen gas.',
        color: '#ffffff',
        tempChange: 'Exothermic (Highly)'
      }
    }

    // Zn + HCl -> ZnCl2 + H2
    if (s1 === 'Zn' && s2 === 'HCl') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Zinc and Hydrochloric Acid',
        equation: 'Zn + 2HCl \u2192 ZnCl\u2082 + H\u2082\u2191',
        description: 'Zinc metal reacts with hydrochloric acid, generating hydrogen bubbles and producing zinc chloride solution.',
        color: '#f1f5f9',
        tempChange: 'Exothermic'
      }
    }

    // Zn + H2SO4 -> ZnSO4 + H2
    if (s1 === 'Zn' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Zinc and Sulfuric Acid',
        equation: 'Zn + H\u2082SO\u2084 \u2192 ZnSO\u2084 + H\u2082\u2191',
        description: 'Zinc reacts rapidly with sulfuric acid to release hydrogen gas and form zinc sulfate solution.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // Fe + HCl -> FeCl2 + H2
    if (s1 === 'Fe' && s2 === 'HCl') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Iron and Hydrochloric Acid',
        equation: 'Fe + 2HCl \u2192 FeCl\u2082 + H\u2082\u2191',
        description: 'Iron filings react steadily with hydrochloric acid, producing hydrogen gas bubbles and giving the solution a pale green iron(II) chloride color.',
        color: '#d1fae5',
        tempChange: 'Exothermic'
      }
    }

    // Fe + H2SO4 -> FeSO4 + H2
    if (s1 === 'Fe' && s2 === 'H2SO4') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Iron and Sulfuric Acid',
        equation: 'Fe + H\u2082SO\u2084 \u2192 FeSO\u2084 + H\u2082\u2191',
        description: 'Iron metal reacts with dilute sulfuric acid to form iron(II) sulfate (turning solution light green) and hydrogen gas.',
        color: '#d1fae5',
        tempChange: 'Exothermic'
      }
    }

    // Fe + CuSO4 -> FeSO4 + Cu (Displacement in solution)
    if (s1 === 'Fe' && s2 === 'CuSO4') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Iron-Copper Displacement',
        equation: 'Fe + CuSO\u2084 \u2192 FeSO\u2084 + Cu\u2193',
        description: 'Iron metal displaces copper from copper(II) sulfate. The blue copper solution slowly fades to light green (iron sulfate), and reddish-brown copper deposits on the iron.',
        color: '#86efac',
        tempChange: 'Exothermic'
      }
    }

    // Zn + CuSO4 -> ZnSO4 + Cu
    if (s1 === 'Zn' && s2 === 'CuSO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Zinc-Copper Displacement',
        equation: 'Zn + CuSO\u2084 \u2192 ZnSO\u2084 + Cu\u2193',
        description: 'Zinc metal displaces copper from blue copper(II) sulfate. The blue color fades to clear zinc sulfate solution, with a dark deposit of metallic copper.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Mg + CuSO4 -> MgSO4 + Cu
    if (s1 === 'Mg' && s2 === 'CuSO4') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Magnesium-Copper Displacement',
        equation: 'Mg + CuSO\u2084 \u2192 MgSO\u2084 + Cu\u2193',
        description: 'Magnesium displaces copper energetically. The blue solution fades to clear magnesium sulfate with copper metal deposit.',
        color: '#ffffff',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Cu + AgNO3 -> Cu(NO3)2 + 2Ag (Silver Tree)
    if (s1 === 'Cu' && s2 === 'AgNO3') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Silver Displacement (Silver Tree)',
        equation: 'Cu + 2AgNO\u2083 \u2192 Cu(NO\u2083)\u2082 + 2Ag\u2193',
        description: 'Single displacement reaction. Copper metal dissolves into the solution, turning it blue due to copper(II) ions, while silver ions are reduced to metallic silver, growing as shiny, spike-like silver crystals on the copper.',
        color: '#3b82f6',
        tempChange: 'Exothermic'
      }
    }

    // Zn + AgNO3 -> Zn(NO3)2 + 2Ag
    if (s1 === 'Zn' && s2 === 'AgNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Zinc-Silver Displacement',
        equation: 'Zn + 2AgNO\u2083 \u2192 Zn(NO\u2083)\u2082 + 2Ag\u2193',
        description: 'Zinc metal displaces silver from silver nitrate. The solution remains colorless, but silver metal precipitates rapidly as dark gray spongy crystals on the zinc.',
        color: '#ffffff',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Fe + AgNO3 -> Fe(NO3)2 + 2Ag
    if (s1 === 'Fe' && s2 === 'AgNO3') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Iron-Silver Displacement',
        equation: 'Fe + 2AgNO\u2083 \u2192 Fe(NO\u2083)\u2082 + 2Ag\u2193',
        description: 'Iron filings displace silver from silver nitrate, depositing needle-like silver crystals and turning the solution a pale green color as iron(II) nitrate forms.',
        color: '#d1fae5',
        tempChange: 'Exothermic'
      }
    }

    // Cu + HNO3 -> Cu(NO3)2 + NO2 + H2O (Vigorous Nitric Acid Oxidation)
    if (s1 === 'Cu' && s2 === 'HNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Vigorous Copper Dissolution in Nitric Acid',
        equation: 'Cu + 4HNO\u2083 \u2192 Cu(NO\u2083)\u2082 + 2NO\u2082\u2191 + 2H\u2082O',
        description: 'Nitric acid acts as a powerful oxidizing acid on copper metal. It reacts vigorously to produce a beautiful blue-green copper(II) nitrate solution and evolves dense, toxic, choking brown nitrogen dioxide (NO2) gas bubbles.',
        color: '#0d9488',
        tempChange: 'Exothermic (Highly)'
      }
    }

    // Zn + HNO3 -> Zn(NO3)2 + NO2 + H2O
    if (s1 === 'Zn' && s2 === 'HNO3') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Zinc Dissolution in Nitric Acid',
        equation: 'Zn + 4HNO\u2083 \u2192 Zn(NO\u2083)\u2082 + 2NO\u2082\u2191 + 2H\u2082O',
        description: 'Zinc metal reacts rapidly with concentrated nitric acid, releasing orange-brown nitrogen dioxide gas bubbles and leaving a colorless zinc nitrate solution.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Fe + H2O2 -> Catalytic decomposition of H2O2
    if (s1 === 'Fe' && s2 === 'H2O2') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Catalytic Hydrogen Peroxide Decomposition',
        equation: '2H\u2082O\u2082 \u2192 2H\u2082O + O\u2082\u2191 (Fe Catalyst)',
        description: 'The iron metal acts as a catalyst, accelerating the decomposition of hydrogen peroxide into water and rapidly bubbling oxygen gas, releasing heat.',
        color: '#e0f2fe',
        tempChange: 'Exothermic'
      }
    }

    // Cu + H2O2 -> Catalytic decomposition
    if (s1 === 'Cu' && s2 === 'H2O2') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Copper-Catalyzed Peroxide Decomposition',
        equation: '2H\u2082O\u2082 \u2192 2H\u2082O + O\u2082\u2191 (Cu Catalyst)',
        description: 'Copper metal catalyzes the decomposition of hydrogen peroxide, generating a steady stream of oxygen gas bubbles.',
        color: '#e0f2fe',
        tempChange: 'Exothermic (Mild)'
      }
    }

    // Cl + KI -> KCl + I2 (Halogen Displacement)
    if (s1 === 'Cl' && s2 === 'KI') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Halogen Displacement (Chlorine-Iodide)',
        equation: '2KI + Cl\u2082 \u2192 2KCl + I\u2082',
        description: 'The highly reactive chlorine gas displaces the less reactive iodine from potassium iodide. The solution instantly turns a dark reddish-brown/purple color as elemental iodine is liberated.',
        color: '#7c2d12',
        tempChange: 'Exothermic'
      }
    }

    // O + CH4 -> CO2 + H2O (Methane Combustion)
    if (s1 === 'O' && s2 === 'CH4') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Methane Combustion',
        equation: 'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O',
        description: 'Vigorous combustion reaction. Ignited methane gas reacts explosively with oxygen, burning with a pale blue flame to produce carbon dioxide gas and water vapor, releasing immense energy.',
        color: '#e0f2fe',
        tempChange: 'Exothermic (Intense)'
      }
    }

    // O + C2H5OH -> CO2 + H2O (Ethanol Combustion)
    if (s1 === 'O' && s2 === 'C2H5OH') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Combustion of Ethanol',
        equation: 'C\u2082H\u2085OH + 3O\u2082 \u2192 2CO\u2082 + 3H\u2082O',
        description: 'Ethanol vapor burns vigorously in oxygen with a clean, hot blue flame, oxidizing completely to carbon dioxide and water vapor.',
        color: '#e0f2fe',
        tempChange: 'Exothermic (High)'
      }
    }

    // 2. SPECIFIC FAMOUS REACTION PAIRS
    // H + O -> H2O (Hydrogen Combustion)
    if (s1 === 'H' && s2 === 'O') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Explosive Synthesis of Water',
        equation: '2H\u2082 + O\u2082 \u2192 2H\u2082O',
        description: 'An extremely explosive combustion reaction. Hydrogen gas acts as the fuel and oxygen acts as the oxidizer. When ignited, they combine instantly to release intense thermal energy and form pure water vapor.',
        color: '#e0f2fe',
        tempChange: 'Exothermic (Highly)'
      }
    }
    
    // Na + Cl -> NaCl (Sodium Chloride Synthesis)
    if (s1 === 'Na' && s2 === 'Cl') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Synthesis of Sodium Chloride',
        equation: '2Na + Cl\u2082 \u2192 2NaCl',
        description: 'A violent redox reaction where soft, highly reactive metallic sodium burns in toxic greenish chlorine gas. Sodium transfers its outer electron to chlorine, releasing bright yellow flames and generating white table salt crystals.',
        color: '#f8fafc',
        tempChange: 'Exothermic (Extreme)'
      }
    }
    
    // Fe + O -> Rust (Iron Oxidation)
    if (s1 === 'O' && s2 === 'Fe') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Oxidation of Iron (Rusting)',
        equation: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083',
        description: 'A slow oxidation (corrosion) process. Iron metal reacts with atmospheric oxygen over time in the presence of moisture, slowly oxidizing to form hydrated iron(III) oxide, commonly known as reddish-brown rust.',
        color: '#78350f',
        tempChange: 'Exothermic (Very Slow)'
      }
    }

    // S + O -> SO2 (Sulfur Combustion)
    if (s1 === 'O' && s2 === 'S') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Combustion of Sulfur',
        equation: 'S + O\u2082 \u2192 SO\u2082',
        description: 'Solid yellow sulfur reacts with oxygen gas upon heating, burning with a characteristic, beautiful pale blue flame and releasing choking, pungent sulfur dioxide gas.',
        color: '#cbd5e1',
        tempChange: 'Exothermic'
      }
    }

    // Fe + Cl -> FeCl3 (Iron Chlorination)
    if (s1 === 'Cl' && s2 === 'Fe') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Chlorination of Iron',
        equation: '2Fe + 3Cl\u2082 \u2192 2FeCl\u2083',
        description: 'Heated iron filings react dynamically when introduced into toxic green chlorine gas, producing a violent reaction with bright sparks and dense reddish-brown smoke/crystals of anhydrous iron(III) chloride.',
        color: '#b45309',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Cu + Cl -> CuCl2 (Copper Chlorination)
    if (s1 === 'Cl' && s2 === 'Cu') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Chlorination of Copper',
        equation: 'Cu + Cl\u2082 \u2192 CuCl\u2082',
        description: 'Copper wire or turnings react with chlorine gas under heating, forming dark green-blue copper(II) chloride solid.',
        color: '#0d9488',
        tempChange: 'Exothermic'
      }
    }

    // Cu + O -> Copper Oxide (s1='O' & s2='Cu')
    if (s1 === 'O' && s2 === 'Cu') {
      return {
        reactive: true,
        reactionType: 'slow',
        title: 'Synthesis of Copper(II) Oxide',
        equation: '2Cu + O\u2082 \u2192 2CuO',
        description: 'Under heating, copper metal reacts slowly with oxygen in the air. The bright reddish copper metal slowly oxidizes on its surface to form a dull black layer of copper(II) oxide.',
        color: '#1e293b',
        tempChange: 'Exothermic (Slow)'
      }
    }

    // Mg + O -> Magnesium Oxide Combustion (s1='O' & s2='Mg')
    if (s1 === 'O' && s2 === 'Mg') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Magnesium Combustion',
        equation: '2Mg + O\u2082 \u2192 2MgO',
        description: 'A rapid combustion reaction. When ignited, magnesium metal reacts vigorously with oxygen in air, burning with a brilliant, blinding white flame. It releases extreme heat and leaves a fine white residue of magnesium oxide.',
        color: '#ffffff',
        tempChange: 'Exothermic (Intense)'
      }
    }

    // C + O -> Carbon Dioxide Combustion
    if (s1 === 'C' && s2 === 'O') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Combustion of Carbon',
        equation: 'C + O\u2082 \u2192 CO\u2082',
        description: 'A rapid combustion process. Solid carbon reacts with oxygen gas at elevated temperatures, forming gaseous carbon dioxide while releasing substantial heat energy.',
        color: '#1e293b',
        tempChange: 'Exothermic'
      }
    }

    // H + Cl -> HCl (Hydrogen Chloride Synthesis)
    if (s1 === 'H' && s2 === 'Cl') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Synthesis of Hydrogen Chloride',
        equation: 'H\u2082 + Cl\u2082 \u2192 2HCl',
        description: 'A photochemical synthesis reaction. In the presence of sunlight or heat, hydrogen gas and chlorine gas react explosively to produce toxic, colorless hydrogen chloride gas.',
        color: '#f1f5f9',
        tempChange: 'Exothermic (Highly)'
      }
    }

    // Zn + S -> ZnS (Zinc Sulfide Synthesis)
    if (s1 === 'S' && s2 === 'Zn') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Synthesis of Zinc Sulfide',
        equation: 'Zn + S \u2192 ZnS',
        description: 'A highly energetic combination reaction. When a mixture of zinc and sulfur powder is heated or ignited, it reacts with a sudden green flash and thick smoke, synthesizing zinc sulfide.',
        color: '#fef08a',
        tempChange: 'Exothermic (Violent)'
      }
    }

    // Fe + S -> FeS (Iron(II) Sulfide Synthesis)
    if (s1 === 'S' && s2 === 'Fe') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Synthesis of Iron(II) Sulfide',
        equation: 'Fe + S \u2192 FeS',
        description: 'A classic synthesis reaction. When a mixture of iron filings and sulfur powder is heated, the sulfur melts and reacts with the iron in a self-sustaining glowing wave to produce black iron(II) sulfide.',
        color: '#1e293b',
        tempChange: 'Exothermic'
      }
    }

    // Cu + S -> Cu2S (Copper(I) Sulfide Synthesis)
    if (s1 === 'S' && s2 === 'Cu') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: 'Synthesis of Copper(I) Sulfide',
        equation: '2Cu + S \u2192 Cu\u2082S',
        description: 'When copper turnings are heated in sulfur vapor, they combine directly in a mild exothermic reaction to form dark blue-black copper(I) sulfide.',
        color: '#334155',
        tempChange: 'Exothermic'
      }
    }

    // Li + O -> Li2O (Lithium Oxidation)
    if (s1 === 'Li' && s2 === 'O') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Oxidation of Lithium',
        equation: '4Li + O\u2082 \u2192 2Li\u2082O',
        description: 'Lithium reacts with oxygen upon heating, burning with a beautiful crimson flame to form white lithium oxide.',
        color: '#ffffff',
        tempChange: 'Exothermic'
      }
    }

    // Na + O -> Na2O2 (Sodium Peroxide Synthesis)
    if (s1 === 'O' && s2 === 'Na') {
      return {
        reactive: true,
        reactionType: 'fast',
        title: 'Synthesis of Sodium Peroxide',
        equation: '2Na + O\u2082 \u2192 Na\u2082O\u2082',
        description: 'When sodium is burned in excess oxygen, it reacts with a bright yellow-orange flame to form pale yellow sodium peroxide.',
        color: '#fef9c3',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // K + O -> KO2 (Potassium Superoxide Synthesis)
    if (s1 === 'O' && s2 === 'K') {
      return {
        reactive: true,
        reactionType: 'explosive',
        title: 'Synthesis of Potassium Superoxide',
        equation: 'K + O\u2082 \u2192 KO\u2082',
        description: 'Potassium reacts violently with oxygen gas, burning with a lilac/purple flame to form orange-yellow potassium superoxide.',
        color: '#fde047',
        tempChange: 'Exothermic (Intense)'
      }
    }

    // 3. GROUP-BASED CHEMICAL SIMILARITY REACTIONS
    
    // Noble gases (Inert)
    if (first.category === 'Noble gas' || second.category === 'Noble gas') {
      const gas = first.category === 'Noble gas' ? first : second
      const other = first.category === 'Noble gas' ? second : first
      return {
        reactive: false,
        reactionType: 'none',
        title: `Inert Mixture of ${gas.name} & ${other.name}`,
        equation: `${first.symbol} + ${second.symbol} \u2192 ${first.symbol} + ${second.symbol} (No Reaction)`,
        description: `${gas.name} is a noble gas with a completely filled valence electron shell, rendering it exceptionally stable and chemically inert. It does not react with ${other.name} under standard conditions, resulting in a simple physical gas mixture.`,
        color: mixColors(getElementColorHex(first), getElementColorHex(second), 0.5),
        tempChange: 'None'
      }
    }

    // Alkali Metals + Halogens (Extreme Salt Syntheses)
    if (
      (first.category === 'Alkali metal' && second.category === 'Halogen') ||
      (first.category === 'Halogen' && second.category === 'Alkali metal')
    ) {
      const alkali = first.category === 'Alkali metal' ? first : second
      const halogen = first.category === 'Halogen' ? first : second
      return {
        reactive: true,
        reactionType: 'explosive',
        title: `Alkali Halide Salt Synthesis`,
        equation: `2${alkali.symbol} + ${halogen.symbol}\u2082 \u2192 2${alkali.symbol}${halogen.symbol}`,
        description: `An extremely violent redox reaction. The highly electropositive alkali metal (${alkali.name}) rapidly transfers its single valence electron to the highly electronegative halogen (${halogen.name}). This reaction releases intense light and heat, forming an ionic salt.`,
        color: '#f1f5f9',
        tempChange: 'Exothermic (Violent)'
      }
    }

    // Alkali Metals + Liquid Mercury (Amalgamation)
    if (
      (first.category === 'Alkali metal' && second.symbol === 'Hg') ||
      (first.symbol === 'Hg' && second.category === 'Alkali metal')
    ) {
      const alkali = first.category === 'Alkali metal' ? first : second
      return {
        reactive: true,
        reactionType: 'moderate',
        title: `${alkali.name}-Mercury Amalgamation`,
        equation: `${alkali.symbol} + xHg \u2192 ${alkali.symbol}Hg_x (Amalgam)`,
        description: `An exothermic amalgamation reaction. The alkali metal (${alkali.name}) dissolves in liquid mercury, forming an alloy called amalgam. This process is highly exothermic, and the resulting amalgam is widely used as a controlled reducing agent in chemistry.`,
        color: '#cbd5e1',
        tempChange: 'Exothermic'
      }
    }

    // Alkaline Earth Metals + Halogens
    if (
      (first.category === 'Alkaline earth metal' && second.category === 'Halogen') ||
      (first.category === 'Halogen' && second.category === 'Alkaline earth metal')
    ) {
      const alkaline = first.category === 'Alkaline earth metal' ? first : second
      const halogen = first.category === 'Halogen' ? first : second
      return {
        reactive: true,
        reactionType: 'fast',
        title: `Alkaline Earth Dihalide Synthesis`,
        equation: `${alkaline.symbol} + ${halogen.symbol}\u2082 \u2192 ${alkaline.symbol}${halogen.symbol}\u2082`,
        description: `A rapid oxidation-reduction reaction. The alkaline earth metal (${alkaline.name}) loses its two valence electrons to the halogen (${halogen.name}), forming a dihalide salt with considerable heat release.`,
        color: '#e2e8f0',
        tempChange: 'Exothermic'
      }
    }

    // Transition Metal + Halogen (Metal Halide Synthesis)
    if (first.category === 'Halogen' || second.category === 'Halogen') {
      const halogen = first.category === 'Halogen' ? first : second
      const metal = first.category === 'Halogen' ? second : first
      
      if (metal.category.includes('metal')) {
        return {
          reactive: true,
          reactionType: 'moderate',
          title: `Synthesis of ${metal.name} Halide`,
          equation: `${metal.symbol} + ${halogen.symbol}\u2082 \u2192 ${metal.symbol}${halogen.symbol}\u2082`,
          description: `Synthesis reaction. The transition/post-transition metal is oxidized by the highly active halogen, forming a colored metal halide complex inside the beaker.`,
          color: '#cbd5e1',
          tempChange: 'Exothermic'
        }
      }
    }

    // Two Metals (Alloy creation)
    if (first.category.includes('metal') && second.category.includes('metal')) {
      return {
        reactive: false,
        reactionType: 'none',
        title: `Metallic Solution / Alloy Phase`,
        equation: `${first.symbol} + ${second.symbol} \u2192 ${first.symbol}${second.symbol} (Alloy)`,
        description: `Metals do not react chemically under standard conditions. However, when heated and merged, they form homogenous solid mixtures called Alloys (like bronze or brass), which possess enhanced hardness and metallic properties.`,
        color: '#94a3b8',
        tempChange: 'None (Requires Heating)'
      }
    }

    // Halogen + Halogen (Interhalogen compounds)
    if (first.category === 'Halogen' && second.category === 'Halogen') {
      return {
        reactive: true,
        reactionType: 'moderate',
        title: `Covalent Interhalogen Synthesis`,
        equation: `${first.symbol}\u2082 + ${second.symbol}\u2082 \u2192 2${first.symbol}${second.symbol}`,
        description: `Direct combination of two different halogens. The less electronegative halogen shares electrons with the more electronegative one, forming a volatile covalent interhalogen compound.`,
        color: '#d8b4fe',
        tempChange: 'Exothermic'
      }
    }

    // === GENERALIZED FALLBACK REACTION ENGINE RULES ===

    // Rule A: General Acid-Base Neutralization
    if (
      (first.category === 'Acid' && second.category === 'Base') ||
      (first.category === 'Base' && second.category === 'Acid')
    ) {
      const acid = first.category === 'Acid' ? first : second
      const base = first.category === 'Base' ? first : second
      return {
        reactive: true,
        reactionType: 'fast',
        title: `Acid-Base Neutralization (${acid.name} + ${base.name})`,
        equation: `${acid.symbol} + ${base.symbol} \u2192 Salt + H\u2082O`,
        description: `A classic neutralization reaction. The acidic hydronium ions from ${acid.name} react with basic hydroxide ions from ${base.name} to form water and a soluble salt. This reaction is exothermic and releases heat energy.`,
        color: '#f8fafc',
        tempChange: 'Exothermic (Mild to Warm)'
      }
    }

    // Rule B: General Acid-Carbonate/Bicarbonate Reaction (Bubbling)
    const isCarbonate = (el) => el.symbol === 'CaCO3' || el.symbol === 'NaHCO3' || el.symbol === 'Na2CO3' || el.name.toLowerCase().includes('carbonate') || el.name.toLowerCase().includes('bicarbonate');
    if (
      (first.category === 'Acid' && isCarbonate(second)) ||
      (second.category === 'Acid' && isCarbonate(first))
    ) {
      const acid = first.category === 'Acid' ? first : second
      const carb = first.category === 'Acid' ? second : first
      return {
        reactive: true,
        reactionType: 'fast',
        title: `Acid-Carbonate Gas Evolution (${acid.name} + ${carb.name})`,
        equation: `${acid.symbol} + ${carb.symbol} \u2192 Salt + H\u2082O + CO\u2082\u2191`,
        description: `A rapid gas-release reaction. The acid ${acid.name} decomposes the carbonate structure of ${carb.name}, releasing carbon dioxide gas in the form of steady effervescent bubbles.`,
        color: '#f1f5f9',
        tempChange: 'Exothermic (Bubbling)'
      }
    }

    // Rule C: Active Metal + Acid (Hydrogen Evolution)
    const isActiveMetal = (el) => el.category === 'Alkali metal' || el.category === 'Alkaline earth metal' || el.symbol === 'Zn' || el.symbol === 'Fe' || el.symbol === 'Al' || el.name.toLowerCase().includes('aluminum') || el.name.toLowerCase().includes('zinc') || el.name.toLowerCase().includes('iron');
    if (
      (first.category === 'Acid' && isActiveMetal(second)) ||
      (second.category === 'Acid' && isActiveMetal(first))
    ) {
      const acid = first.category === 'Acid' ? first : second
      const metal = first.category === 'Acid' ? second : first
      return {
        reactive: true,
        reactionType: 'fast',
        title: `Metal-Acid Hydrogen Evolution (${metal.name} + ${acid.name})`,
        equation: `${metal.symbol} + ${acid.symbol} \u2192 Salt + H\u2082\u2191`,
        description: `Single displacement reaction. The active metal ${metal.name} displaces hydrogen from the acid ${acid.name}, releasing bubbles of highly flammable hydrogen gas and forming a metal salt solution.`,
        color: '#f1f5f9',
        tempChange: 'Exothermic (Vigorous)'
      }
    }

    // Rule D: Organic Combustion with Oxygen
    const isOrganic = (el) => el.category === 'Organic' || el.symbol === 'CH4' || el.symbol === 'C2H5OH' || el.symbol === 'Ethanol' || el.symbol === 'Methanol';
    if (
      (first.symbol === 'O' && isOrganic(second)) ||
      (second.symbol === 'O' && isOrganic(first))
    ) {
      const org = first.symbol === 'O' ? second : first
      return {
        reactive: true,
        reactionType: 'explosive',
        title: `Combustion of ${org.name}`,
        equation: `${org.symbol} + O\u2082 \u2192 CO\u2082 + H\u2082O`,
        description: `Highly energetic combustion reaction. The organic compound ${org.name} reacts explosively with oxygen, burning with high-temperature flames to completely oxidize into carbon dioxide gas and water vapor.`,
        color: '#fde047',
        tempChange: 'Exothermic (Extreme Flames)'
      }
    }

    // Rule E: Halide Precipitation (Silver / Lead Halides)
    const isPrecipitant = (el) => el.symbol === 'AgNO3' || el.symbol === 'Pb(NO3)2';
    const isHalide = (el) => el.symbol === 'KI' || el.symbol === 'NaCl' || el.symbol === 'KCl' || el.symbol === 'CaCl2' || el.symbol === 'MgCl2' || el.symbol === 'HBr' || el.symbol === 'HI' || el.name.toLowerCase().includes('chloride') || el.name.toLowerCase().includes('bromide') || el.name.toLowerCase().includes('iodide');
    if (
      (isPrecipitant(first) && isHalide(second)) ||
      (isPrecipitant(second) && isHalide(first))
    ) {
      const prec = isPrecipitant(first) ? first : second
      const hal = isPrecipitant(first) ? second : first
      const colorHex = hal.symbol.endsWith('I') || hal.name.toLowerCase().includes('iodide') ? '#fde047' : '#ffffff';
      const precipitateName = prec.symbol === 'AgNO3' ? 'Silver' : 'Lead';
      const halideType = hal.symbol.endsWith('I') || hal.name.toLowerCase().includes('iodide') ? 'Iodide' : 
                          hal.symbol.endsWith('Cl') || hal.name.toLowerCase().includes('chloride') ? 'Chloride' : 'Halide';
      return {
        reactive: true,
        reactionType: 'fast',
        title: `${precipitateName} ${halideType} Precipitation`,
        equation: `${prec.symbol} + ${hal.symbol} \u2192 ${precipitateName}${halideType}\u2193 + Nitrate Salt`,
        description: `Double displacement precipitation. Mixing the clear precipitant ${prec.name} and the halide solution ${hal.name} yields an instant solid precipitate of insoluble ${precipitateName} ${halideType}, clouding the solution.`,
        color: colorHex,
        tempChange: 'None'
      }
    }

    // DEFAULT COEXISTENCE (Physical mixture)
    return {
      reactive: false,
      reactionType: 'none',
      title: `Physical Mixture of ${first.name} & ${second.name}`,
      equation: `${first.symbol} + ${second.symbol} \u2192 ${first.symbol} + ${second.symbol} (Physical Mix)`,
      description: `No chemical reaction occurs between these two substances under standard conditions. They coexist physically as a mixture, retaining their individual chemical structures, states, and properties.`,
      color: mixColors(getElementColorHex(first), getElementColorHex(second), 0.5),
      tempChange: 'None'
    }
  }

  // Pouring Tilt Animation loop
  const triggerReaction = () => {
    if (!leftEl || !rightEl || isReacting) return
    
    setIsReacting(true)
    setIsCompleted(false)
    setReactionProgress(0)
    
    const reaction = analyzeReaction(leftEl, rightEl)
    setReactionData(reaction)
    
    let currentProg = 0
    const interval = setInterval(() => {
      currentProg += 0.01
      setReactionProgress(currentProg)
      
      // Calculate dynamic tilt angles for test tubes
      // Phase 1 (0 to 0.5): Tubes tilt down to pour
      if (currentProg < 0.35) {
        setTiltAngle((currentProg / 0.35) * 1.3) // Tilt up to 75 deg (1.3 rad)
      } else if (currentProg >= 0.35 && currentProg < 0.48) {
        setTiltAngle(1.3) // Hold pouring angle
      } else if (currentProg >= 0.48 && currentProg < 0.65) {
        // Return to normal
        const backFactor = (0.65 - currentProg) / 0.17
        setTiltAngle(backFactor * 1.3)
      } else {
        setTiltAngle(0)
      }
      
      if (currentProg >= 1.0) {
        clearInterval(interval)
        setIsReacting(false)
        setIsCompleted(true)
      }
    }, 40)
  }

  const handleReset = () => {
    setIsReacting(false)
    setIsCompleted(false)
    setReactionProgress(0)
    setReactionData(null)
    setTiltAngle(0)
  }

  const openSelector = (side) => {
    if (isReacting) return
    setSelectorSide(side)
    setIsSelectorOpen(true)
  }

  const selectElement = (el) => {
    if (selectorSide === 'left') {
      setLeftEl(el)
    } else {
      setRightEl(el)
    }
    setIsSelectorOpen(false)
    handleReset()
  }

  // Helper colors mapping
  function getElementColorHex(el) {
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

  function mixColors(c1, c2, balance) {
    c1 = c1.replace('#', '')
    c2 = c2.replace('#', '')
    
    const r1 = parseInt(c1.substring(0, 2), 16)
    const g1 = parseInt(c1.substring(2, 4), 16)
    const b1 = parseInt(c1.substring(4, 6), 16)
    
    const r2 = parseInt(c2.substring(0, 2), 16)
    const g2 = parseInt(c2.substring(2, 4), 16)
    const b2 = parseInt(c2.substring(4, 6), 16)
    
    const r = Math.floor(r1 * (1 - balance) + r2 * balance).toString(16).padStart(2, '0')
    const g = Math.floor(g1 * (1 - balance) + g2 * balance).toString(16).padStart(2, '0')
    const b = Math.floor(b1 * (1 - balance) + b2 * balance).toString(16).padStart(2, '0')
    
    return `#${r}${g}${b}`
  }

  // Filter list of reactants in modal
  const filteredSelectorList = reactants.filter(el => {
    // Filter by type
    if (reactantTypeFilter === 'elements' && el.isCompound) return false
    if (reactantTypeFilter === 'compounds' && !el.isCompound) return false
    
    // Filter by search query
    const nameMatch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (el.atomicNumber && el.atomicNumber.toString() === searchQuery)
                      
    // Filter by category
    const catMatch = !filterCategory || el.category === filterCategory
    
    return nameMatch && catMatch
  })

  // Set category colors in list items
  const getItemColor = (cat) => {
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

  return (
    <div className="reaction-layout">
      {/* 3D Reaction Bench */}
      <div className="glass-card reaction-chamber">
        
        {/* Left Tube Station */}
        <div className={`tube-station ${isReacting && reactionProgress < 0.65 ? 'tilting-left' : ''}`}>
          <div className="tube-station-title">Left Tube</div>
          <div className="element-selector-tray">
            <button className="selector-btn" onClick={() => openSelector('left')}>
              {leftEl ? (
                <>
                  <span>{leftEl.symbol} - {leftEl.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{leftEl.atomicNumber}</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Select Reactant...</span>
              )}
            </button>
          </div>
          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            {leftEl ? (
              <TestTube3D 
                element={leftEl} 
                isPouring={isReacting} 
                tiltAngle={tiltAngle} 
                pouringSide="left" 
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                Empty Stand
              </div>
            )}
          </div>
        </div>

        {/* Central Beaker */}
        <div className="beaker-station">
          <div className="tube-station-title" style={{ marginBottom: '1rem' }}>Reaction Beaker</div>
          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            <Beaker 
              leftElement={leftEl}
              rightElement={rightEl}
              reactionProgress={reactionProgress}
              isReacting={isReacting}
              isCompleted={isCompleted}
              reactionType={reactionData ? reactionData.reactionType : 'none'}
              resultColor={reactionData ? reactionData.color : '#64748b'}
            />
          </div>
        </div>

        {/* Right Tube Station */}
        <div className={`tube-station ${isReacting && reactionProgress < 0.65 ? 'tilting-right' : ''}`}>
          <div className="tube-station-title">Right Tube</div>
          <div className="element-selector-tray">
            <button className="selector-btn" onClick={() => openSelector('right')}>
              {rightEl ? (
                <>
                  <span>{rightEl.symbol} - {rightEl.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{rightEl.atomicNumber}</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Select Reactant...</span>
              )}
            </button>
          </div>
          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            {rightEl ? (
              <TestTube3D 
                element={rightEl} 
                isPouring={isReacting} 
                tiltAngle={tiltAngle} 
                pouringSide="right" 
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                Empty Stand
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Controls */}
      <div className="action-hub">
        <button 
          className="action-btn action-btn-primary" 
          onClick={triggerReaction}
          disabled={!leftEl || !rightEl || isReacting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 5h20c0-2-1-3.75-2.5-5M12 2v10M8 8l4-4 4 4" />
          </svg>
          Combine & React
        </button>
        
        <button 
          className="action-btn action-btn-secondary" 
          onClick={handleReset}
          disabled={isReacting || (!leftEl && !rightEl && !reactionData)}
        >
          Reset Lab
        </button>
      </div>

      {/* Detailed Chemical Report Card */}
      {reactionProgress >= 0.5 && reactionData && (
        <div 
          className={`glass-card result-card ${
            reactionData.reactionType === 'explosive' 
              ? 'explosive' 
              : reactionData.reactive 
                ? 'reactive' 
                : 'inert'
          }`}
          style={{ animation: 'fade-in 0.3s ease-out' }}
        >
          {isCompleted && (
            <div style={{
              background: 'var(--success-glow)',
              color: 'var(--success)',
              border: '1px solid var(--success)',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              width: 'fit-content'
            }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s infinite' }}></span>
              ✓ Reaction Concluded & Stable
            </div>
          )}
          
          <div className="result-header">
            <div className="result-title">{reactionData.title}</div>
            <span className={`reaction-speed-tag speed-${reactionData.reactionType}`}>
              Speed: {reactionData.reactionType}
            </span>
          </div>

          <div className="equation-box">
            {reactionData.equation}
          </div>

          <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {reactionData.description}
          </p>

          <div className="result-properties">
            <div className="info-card">
              <div className="info-label">Thermodynamics</div>
              <div className="info-value" style={{ color: reactionData.tempChange.includes('Exo') ? 'var(--danger)' : 'var(--text-primary)' }}>
                {reactionData.tempChange}
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-label">Product State</div>
              <div className="info-value">
                {reactionData.reactionType === 'explosive' ? 'Gas / Plasma' : 'Aqueous Complex'}
              </div>
            </div>

            <div className="info-card">
              <div className="info-label">Visual Effect</div>
              <div className="info-value" style={{ textTransform: 'capitalize' }}>
                {reactionData.reactionType === 'explosive' ? 'Combustion & Smoke' : reactionData.reactive ? 'Bubbling Wave' : 'Uniform Color Merging'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reaction Table */}
      {reactionProgress >= 0.5 && reactionData && (
        <div className="glass-card reaction-table-wrap" style={{ animation: 'fade-in 0.3s ease-out' }}>
          <div className="reaction-table-title">Reaction Table</div>
          <div className="reaction-table-grid">
            <div className="reaction-table-cell">
              <div className="reaction-table-label">Reactant A (Left)</div>
              <div className="reaction-table-value">{leftEl ? `${leftEl.symbol} - ${leftEl.name}` : '—'}</div>
            </div>
            <div className="reaction-table-cell">
              <div className="reaction-table-label">Reactant B (Right)</div>
              <div className="reaction-table-value">{rightEl ? `${rightEl.symbol} - ${rightEl.name}` : '—'}</div>
            </div>

            <div className="reaction-table-cell">
              <div className="reaction-table-label">Reaction Type</div>
              <div className="reaction-table-value">{reactionData.reactionType}</div>
            </div>

            <div className="reaction-table-cell" style={{ gridColumn: 'span 2' }}>
              <div className="reaction-table-label">Equation</div>
              <div className="reaction-table-equation">{reactionData.equation}</div>
            </div>

            <div className="reaction-table-cell">
              <div className="reaction-table-label">Thermodynamics</div>
              <div className="reaction-table-value" style={{ color: reactionData.tempChange.includes('Exo') ? 'var(--danger)' : 'var(--text-primary)' }}>
                {reactionData.tempChange}
              </div>
            </div>

            <div className="reaction-table-cell">
              <div className="reaction-table-label">Product Visual</div>
              <div className="reaction-table-value">
                {reactionData.reactionType === 'explosive'
                  ? 'Gas / Plasma'
                  : 'Aqueous Complex / Mixture'}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/assistant', { 
              state: { 
                query: `Explain the chemical reaction between ${leftEl?.name} (${leftEl?.symbol}) and ${rightEl?.name} (${rightEl?.symbol}) in detail, including reaction mechanism, state changes, enthalpy, and safety hazards.` 
              } 
            })}
            className="action-btn action-btn-primary"
            style={{ 
              marginTop: '1rem', 
              width: '100%', 
              justifyContent: 'center', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <Bot size={18} />
            <span>Ask ChemBot AI About This Reaction</span>
          </button>
        </div>
      )}

      {/* Select Element Overlay Modal popup */}

      {isSelectorOpen && (
        <div className="dropdown-overlay" onClick={() => setIsSelectorOpen(false)}>
          <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-search">
              <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                Choose Reactant for {selectorSide === 'left' ? 'Left Tube' : 'Right Tube'}
              </h3>
              
              <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {/* Reactant Type Selector */}
                  <select
                    className="filter-select"
                    value={reactantTypeFilter}
                    onChange={(e) => {
                      setReactantTypeFilter(e.target.value)
                      setFilterCategory('') // Reset category filter on type change
                    }}
                    style={{ flex: 1 }}
                  >
                    <option value="all">All Reactants</option>
                    <option value="elements">Elements Only</option>
                    <option value="compounds">Compounds Only</option>
                  </select>

                  {/* Group category filter */}
                  <select
                    className="filter-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="">All Categories</option>
                    {(reactantTypeFilter === 'all' || reactantTypeFilter === 'elements') && (
                      <>
                        <option value="Nonmetal">Nonmetals</option>
                        <option value="Noble gas">Noble Gases</option>
                        <option value="Alkali metal">Alkali Metals</option>
                        <option value="Alkaline earth metal">Alkaline Earths</option>
                        <option value="Transition metal">Transition Metals</option>
                        <option value="Post-transition metal">Post-Transition</option>
                        <option value="Metalloid">Metalloids</option>
                        <option value="Halogen">Halogens</option>
                        <option value="Lanthanide">Lanthanides</option>
                        <option value="Actinide">Actinides</option>
                      </>
                    )}
                    {(reactantTypeFilter === 'all' || reactantTypeFilter === 'compounds') && (
                      <>
                        <option value="Acid">Acids (Compounds)</option>
                        <option value="Base">Bases (Compounds)</option>
                        <option value="Salt">Salts (Compounds)</option>
                        <option value="Oxide">Oxides (Compounds)</option>
                        <option value="Organic">Organic Compounds</option>
                      </>
                    )}
                  </select>
                </div>
                
                {/* Search query input */}
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by symbol, formula, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
            </div>

            <div className="dropdown-list">
              {filteredSelectorList.map(el => {
                const col = getItemColor(el.category)
                return (
                  <div 
                    key={el.atomicNumber} 
                    className="dropdown-item"
                    onClick={() => selectElement(el)}
                    style={{ '--item-color': col }}
                  >
                    <span className="dropdown-item-symbol" style={{ color: col }}>
                      {el.symbol}
                    </span>
                    <div className="dropdown-item-info">
                      <span className="dropdown-item-name">{el.name}</span>
                      <span className="dropdown-item-num">#{el.atomicNumber}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div style={{ padding: '1rem', textAlign: 'right', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="action-btn action-btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setIsSelectorOpen(false)}
              >
                Close Selection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
