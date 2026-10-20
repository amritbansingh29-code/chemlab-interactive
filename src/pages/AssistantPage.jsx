import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Bot, MessageSquare, ChevronDown, Search, X, ExternalLink, Sparkles, 
  Copy, Check, RotateCcw, HelpCircle, ShieldAlert, Send, Mic, MicOff, 
  Volume2, VolumeX, Download, FlaskConical, Compass 
} from 'lucide-react'
import { sendChemBotMessage, AI_MODES } from '../utils/chemAiService.js'
import { chemistryQA } from '../data/chemistryQA.js'
import { elements } from '../data/elements.js'
import { compounds } from '../data/compounds.js'

const allReactants = [...elements, ...compounds]
const findReactantBySymbol = (sym) => allReactants.find(r => r.symbol.toLowerCase() === sym.toLowerCase()) || null

// Categorization helper
const getQuestionCategory = (q) => {
  const query = q.toLowerCase()
  if (query.includes('safety') || query.includes('spill') || query.includes('smell') || query.includes('burner') || query.includes('procedure') || query.includes('nfpa') || query.includes('lab') || query.includes('beaker')) {
    return '🛡️ Lab Safety & Guidelines'
  }
  if (query.includes('noble gas') || query.includes('alkali') || query.includes('halogen') || query.includes('electronegativity') || query.includes('radius') || query.includes('ionization') || query.includes('atom') || query.includes('isotope') || query.includes('valence') || query.includes('octet') || query.includes('periodic')) {
    return '⚛️ Elements & Periodic Table'
  }
  if (query.includes('bond') || query.includes('mole') || query.includes('stoichiometry') || query.includes('limiting') || query.includes('mass') || query.includes('mixture') || query.includes('compound')) {
    return '🤝 Bonding & Stoichiometry'
  }
  if (query.includes('law') || query.includes('gas') || query.includes('molarity') || query.includes('solub') || query.includes('precipitate')) {
    return '🎈 Gases & Solutions'
  }
  if (query.includes('acid') || query.includes('base') || query.includes('ph') || query.includes('neutral') || query.includes('titration') || query.includes('chatelier') || query.includes('gibbs') || query.includes('redox') || query.includes('displacement') || query.includes('synthesis') || query.includes('decomposition') || query.includes('combustion') || query.includes('reaction') || query.includes('catalyst') || query.includes('exothermic') || query.includes('physical')) {
    return '🔬 Reactions & Acid-Bases'
  }
  if (query.includes('organic') || query.includes('alkane') || query.includes('nomenclature')) {
    return '🌿 Organic Chemistry'
  }
  return '📚 General Chemistry'
}

// LaTeX and Markdown Formatter
function formatMarkdown(text) {
  if (!text) return ''
  
  // Convert math latex to clean unicode/html
  const formatMathLatex = (latex) => {
    let clean = latex
    clean = clean.replace(/\\rightarrow/g, ' → ')
    clean = clean.replace(/\\longrightarrow/g, ' ⟶ ')
    clean = clean.replace(/\\rightleftharpoons/g, ' ⇌ ')
    clean = clean.replace(/\\uparrow/g, ' ↑')
    clean = clean.replace(/\\downarrow/g, ' ↓')
    clean = clean.replace(/\\Delta/g, 'Δ')
    clean = clean.replace(/\\log/g, 'log')
    clean = clean.replace(/\\cdot/g, '·')
    clean = clean.replace(/\\times/g, '×')
    clean = clean.replace(/\\le/g, '≤')
    clean = clean.replace(/\\ge/g, '≥')
    clean = clean.replace(/\\mathbf\{([^}]+)\}/g, '<strong>$1</strong>')
    
    // Replace \text{XYZ} with XYZ
    let textMatch
    while ((textMatch = /\\text\{(.+?)\}/.exec(clean)) !== null) {
      clean = clean.replace(textMatch[0], textMatch[1])
    }
    
    // Replace subscripts and superscripts
    clean = clean.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    clean = clean.replace(/\^([0-9a-zA-Z+-]+)/g, '<sup>$1</sup>')
    clean = clean.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    clean = clean.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>')
    
    return clean
  }

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks: ``` ... ```
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="chat-code-block"><code>${code.trim()}</code></pre>`
  })

  // Inline code: `...`
  html = html.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>')

  // 1. Table formatting
  const tableRegex = /\|(.+)\|[\r\n]+\|([-:|\s]+)\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g
  html = html.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
    const headers = headerRow.split('|').map(h => h.trim()).filter(h => h)
    const bodyLines = bodyRows.split('\n').map(line => line.trim()).filter(line => line)
    
    let tableHtml = '<div class="table-responsive"><table class="markdown-table"><thead><tr>'
    headers.forEach(h => {
      tableHtml += `<th>${h}</th>`
    })
    tableHtml += '</tr></thead><tbody>'
    
    bodyLines.forEach(line => {
      if (!line) return
      const cols = line.split('|').map(c => c.trim()).filter((c, idx) => idx > 0 && idx <= headers.length)
      tableHtml += '<tr>'
      cols.forEach(c => {
        tableHtml += `<td>${formatMathLatex(c)}</td>`
      })
      tableHtml += '</tr>'
    })
    
    tableHtml += '</tbody></table></div>'
    return tableHtml
  })

  // 2. Math blocks: $$ ... $$ or \[ ... \]
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, p1) => {
    return `<div class="math-block">${formatMathLatex(p1)}</div>`
  })
  html = html.replace(/\\\[([\s\S]+?)\\\]/g, (match, p1) => {
    return `<div class="math-block">${formatMathLatex(p1)}</div>`
  })

  // 3. Math inline: $ ... $ or \( ... \)
  html = html.replace(/\$([^$]+?)\$/g, (match, p1) => {
    return `<span class="math-inline">${formatMathLatex(p1)}</span>`
  })
  html = html.replace(/\\\((.+?)\\\)/g, (match, p1) => {
    return `<span class="math-inline">${formatMathLatex(p1)}</span>`
  })

  // 4. Headers: ### Title
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // Blockquotes: > quote
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="chat-blockquote">$1</blockquote>')

  // 5. Bold & Italic text: **text**
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 6. Split into lines to manage lists and paragraphs
  const lines = html.split('\n')
  let inList = false
  let result = []
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    if (!line) {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      continue
    }
    
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        result.push('<ul class="md-list">')
        inList = true
      }
      result.push(`<li>${line.substring(2)}</li>`)
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inList) {
        result.push('<ul class="md-list ordered">')
        inList = true
      }
      const textOnly = line.replace(/^\d+\.\s+/, '')
      result.push(`<li>${textOnly}</li>`)
    } else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      
      if (!line.startsWith('<h') && !line.startsWith('<div') && !line.startsWith('<table') && !line.startsWith('<pre') && !line.startsWith('<blockquote') && !line.startsWith('<t') && !line.startsWith('</t') && !line.startsWith('</div') && !line.startsWith('<ul') && !line.startsWith('</ul')) {
        result.push(`<p class="md-p">${line}</p>`)
      } else {
        result.push(line)
      }
    }
  }
  
  if (inList) {
    result.push('</ul>')
  }
  
  return result.join('\n')
}

const QUICK_PROMPTS = [
  { label: '⚖️ Balance C₃H₈ + O₂', query: 'Balance C3H8 + O2 -> CO2 + H2O' },
  { label: '🧪 Molar Mass of H₂SO₄', query: 'Calculate molar mass of H2SO4' },
  { label: '💥 Na + H₂O Reaction', query: 'What happens when Sodium is mixed with Water?' },
  { label: '🛡️ Acid to Water Rule', query: 'Why must we always add acid to water, and never water to acid?' },
  { label: '⚗️ Le Chatelier Principle', query: 'Explain Le Chatelier principle with temperature and pressure shifts' },
  { label: '⚛️ Electronegativity', query: 'Which is the most electronegative element and why?' }
]

export default function AssistantPage({ onLoadLeft, onLoadRight, setSelectedElement }) {
  const navigate = useNavigate()
  const location = useLocation()
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "### 🧪 Welcome to ChemBot AI 2.0!\n\nI am your interactive chemistry artificial intelligence assistant — **100% free of cost, no API keys or setup required**.\n\n**What I can do for you:**\n- ⚖️ **Balance Equations:** Type any reaction like `Balance Fe + O2 -> Fe2O3` or `C3H8 + O2 -> CO2 + H2O`.\n- 🔬 **Molar Mass & Stoichiometry:** Ask `Molar mass of Ca(OH)2` or `Mass percent of Glucose`.\n- ⚗️ **Reaction Simulations:** Ask what happens when mixing any elements to launch them in the **Virtual Lab**!\n- 🛡️ **Laboratory Safety:** Instant protocols for acid dilution, vapor wafting, spills, and NFPA diamond.\n- ⚛️ **Periodic Trends:** Deep facts on electronegativity, ionization energy, and orbitals.\n\n*Type any chemistry question below or choose a quick prompt to start!*",
      modelBadge: '✨ Free AI Companion (Zero Config)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [speakingIndex, setSpeakingIndex] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [selectedAiMode, setSelectedAiMode] = useState('auto') // 'auto' | 'cloud' | 'local'
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false)
  const [dbSearchQuery, setDbSearchQuery] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState({})
  
  const recognitionRef = useRef(null)

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setSpeechSupported(true)
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-US'

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript)
        setIsRecording(false)
      }

      rec.onerror = () => {
        setIsRecording(false)
      }

      rec.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = rec
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Support incoming queries via navigation state (e.g. from VirtualLab or Explore)
  useEffect(() => {
    if (location.state && location.state.query) {
      const incomingQuery = location.state.query
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title)
      executeUserPrompt(incomingQuery)
    }
  }, [location.state])

  // Categorize 40+ curated questions for Database Explorer modal
  const categorizedQuestions = chemistryQA.reduce((acc, current) => {
    const cat = getQuestionCategory(current.q)
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(current)
    return acc
  }, {})

  const getFilteredCategorizedQuestions = () => {
    if (!dbSearchQuery) return categorizedQuestions
    const filtered = {}
    Object.keys(categorizedQuestions).forEach(cat => {
      const matched = categorizedQuestions[cat].filter(q => 
        q.q.toLowerCase().includes(dbSearchQuery.toLowerCase()) || 
        q.a.toLowerCase().includes(dbSearchQuery.toLowerCase())
      )
      if (matched.length > 0) filtered[cat] = matched
    })
    return filtered
  }

  const activeCategorizedQuestions = getFilteredCategorizedQuestions()

  // Execute User Prompt
  const executeUserPrompt = async (prompt) => {
    if (!prompt.trim() || isTyping) return

    const userText = prompt.trim()
    setInputText('')

    const userMsg = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      const aiResponse = await sendChemBotMessage(userText, messages, selectedAiMode)
      
      const botMsg = {
        sender: 'bot',
        text: aiResponse.text,
        actions: aiResponse.actions || [],
        modelBadge: aiResponse.modelBadge || '✨ ChemBot AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
    } catch {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I encountered an unexpected issue connecting to the inference engine. Please check your query or toggle to the Instant Local Engine mode.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    executeUserPrompt(inputText)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      executeUserPrompt(inputText)
    }
  }

  // Voice recording toggle
  const toggleRecording = () => {
    if (!recognitionRef.current) return
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch {
        setIsRecording(false)
      }
    }
  }

  // Text to Speech
  const handleSpeakText = (text, index) => {
    if (!window.speechSynthesis) return
    if (speakingIndex === index) {
      window.speechSynthesis.cancel()
      setSpeakingIndex(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#$`|\\[\]]/g, '').replace(/→|⟶/g, 'produces').replace(/\+/g, 'plus')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.onend = () => setSpeakingIndex(null)
    utterance.onerror = () => setSpeakingIndex(null)
    
    setSpeakingIndex(index)
    window.speechSynthesis.speak(utterance)
  }

  // Interactive Action Pills (Virtual Lab, Explore, Classroom)
  const handleActionClick = (action) => {
    if (action.type === 'lab') {
      const leftReactant = findReactantBySymbol(action.left)
      const rightReactant = findReactantBySymbol(action.right)
      
      if (leftReactant && rightReactant) {
        onLoadLeft(leftReactant)
        onLoadRight(rightReactant)
        navigate('/virtual-lab')
      }
    } else if (action.type === 'explore') {
      const elementObj = findReactantBySymbol(action.symbol)
      if (elementObj) {
        setSelectedElement(elementObj)
        navigate('/explore')
      }
    } else if (action.type === 'classroom') {
      navigate('/classroom')
    }
  }

  // Copy to clipboard
  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text.replace(/[#*`$]/g, ''))
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Regenerate last response
  const handleRegenerate = () => {
    // Find last user message
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user')
    if (lastUserMsg) {
      executeUserPrompt(lastUserMsg.text)
    }
  }

  // Clear Chat history
  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    setMessages([
      {
        sender: 'bot',
        text: "### 🧪 ChemBot AI Session Reset\n\nChat history cleared. How can I assist you in the chemistry lab today?\n\n- Try typing an equation to balance (e.g. `Balance Al + O2 -> Al2O3`)\n- Ask for molar mass (e.g. `Molar mass of CuSO4`)\n- Ask about reaction mechanisms, periodic trends, or safety rules!",
        modelBadge: '✨ Free AI Companion',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  // Export Study Notes
  const handleExportNotes = () => {
    let mdContent = `# ChemLab Interactive - ChemBot AI Study Notes\n`
    mdContent += `Generated: ${new Date().toLocaleString()}\n\n---\n\n`
    messages.forEach((m, idx) => {
      const role = m.sender === 'user' ? '👤 Student' : '🧪 ChemBot AI'
      mdContent += `### ${role} (${m.timestamp})\n\n${m.text}\n\n---\n\n`
    })

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ChemBot_Study_Notes_${new Date().toISOString().slice(0, 10)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-view explore-page">
      {/* Top Hero Section */}
      <section className="page-hero glass-card" style={{ padding: '1.25rem 2rem' }}>
        <div className="hero-copy">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="hero-eyebrow" style={{ margin: 0 }}>Free Chemistry AI Assistant</span>
            <span 
              className="ai-active-pill" 
              style={{
                background: selectedAiMode === 'local' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: selectedAiMode === 'local' ? '#facc15' : '#34d399',
                border: `1px solid ${selectedAiMode === 'local' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                fontSize: '0.72rem',
                fontWeight: '600',
                padding: '0.15rem 0.6rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedAiMode === 'local' ? '#facc15' : '#34d399', display: 'inline-block' }}></span>
              {selectedAiMode === 'local' ? 'Offline Local Engine (0ms)' : 'Cloud AI Active (100% Free)'}
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', margin: '0.2rem 0 0.4rem' }}>ChemBot AI Laboratory Companion</h1>
          <p className="hero-description" style={{ fontSize: '0.88rem', margin: 0, maxWidth: '680px' }}>
            Instant balance calculations, stoichiometry solvers, reactivity predictions, and lab safety rules. Zero API key, zero cost, completely functional.
          </p>
        </div>

        {/* Engine mode switcher & utility buttons */}
        <div className="hero-panel-small" style={{ gap: '0.75rem' }}>
          {/* Mode Selector */}
          <div className="hero-panel-item" style={{ padding: '0.6rem 0.9rem', minWidth: '150px' }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>AI Engine Mode</span>
            <select
              value={selectedAiMode}
              onChange={(e) => setSelectedAiMode(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.78rem',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                marginTop: '0.3rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {AI_MODES.map(mode => (
                <option key={mode.id} value={mode.id} style={{ background: '#121420', color: '#fff' }}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export Notes */}
          <div 
            className="hero-panel-item" 
            onClick={handleExportNotes} 
            title="Download conversation study notes"
            style={{ cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.2s ease' }}
          >
            <Download size={18} style={{ color: 'var(--primary)', marginBottom: '3px' }} />
            <span style={{ fontSize: '0.72rem' }}>Export Notes</span>
          </div>

          {/* Reset Chat */}
          <div 
            className="hero-panel-item" 
            onClick={handleResetChat} 
            title="Clear current conversation"
            style={{ cursor: 'pointer', border: '1px dashed var(--primary)' }}
          >
            <RotateCcw size={18} style={{ color: 'var(--primary)', marginBottom: '3px' }} />
            <span style={{ fontSize: '0.72rem' }}>Reset Chat</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Chat Workspace */}
      <div className="assistant-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', marginTop: '0.5rem', height: 'calc(100vh - 290px)', minHeight: '520px' }}>
        
        {/* Left Side: Quick Navigation & Assistant Tools */}
        <div className="glass-card assistant-sidebar" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: '#fff' }}>AI Capabilities</h3>
            </div>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          </div>

          {/* Action shortcut to open 40+ Preloaded Database */}
          <button
            onClick={() => setIsDatabaseModalOpen(true)}
            className="action-btn action-btn-primary"
            style={{
              padding: '0.65rem 0.9rem',
              fontSize: '0.78rem',
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <HelpCircle size={15} />
            <span>Browse 40+ QA Topics</span>
          </button>

          {/* Quick Prompts List */}
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Instant Chemistry Prompts
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => executeUserPrompt(item.query)}
                  className="quick-chip-btn"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-secondary)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    lineHeight: '1.3',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Laboratory Navigation */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Lab Integration
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => navigate('/virtual-lab')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FlaskConical size={14} style={{ color: 'var(--primary)' }} />
                <span>Open Virtual Reaction Bench</span>
              </button>
              <button
                onClick={() => navigate('/explore')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Compass size={14} style={{ color: '#38bdf8' }} />
                <span>3D Periodic Explorer</span>
              </button>
            </div>
          </div>

          {/* Safety Rule Card */}
          <div style={{ marginTop: 'auto', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <ShieldAlert size={15} style={{ color: '#f59e0b' }} />
              <strong style={{ fontSize: '0.74rem', color: '#fff' }}>Zero-Config AI</strong>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              No API key or payment needed. Uses free Pollinations neural inference with local offline failover.
            </p>
          </div>
        </div>

        {/* Right Side: Chat Workspace */}
        <div className="glass-card chat-workspace" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
          
          {/* Chat Messages Log */}
          <div className="chat-log" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-bubble-container ${msg.sender === 'user' ? 'user-align' : 'bot-align'}`}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div 
                  className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                  style={{
                    maxWidth: '85%',
                    padding: '1rem 1.25rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary), #4f46e5)' : 'rgba(26, 29, 48, 0.65)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'var(--glass-shadow)',
                    position: 'relative'
                  }}
                >
                  {/* Sender Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {msg.sender === 'bot' ? (
                        <Bot size={16} style={{ color: 'var(--primary)' }} />
                      ) : (
                        <MessageSquare size={14} style={{ color: '#a5b4fc' }} />
                      )}
                      <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#fff' }}>
                        {msg.sender === 'bot' ? 'ChemBot AI' : 'You (Student)'}
                      </span>
                      {msg.modelBadge && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          {msg.modelBadge}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                      {msg.sender === 'bot' && (
                        <>
                          {/* Text to Speech Speaker */}
                          <button 
                            onClick={() => handleSpeakText(msg.text, index)}
                            style={{ background: 'none', border: 'none', color: speakingIndex === index ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                            title={speakingIndex === index ? "Stop speaking" : "Listen to explanation"}
                          >
                            {speakingIndex === index ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          </button>

                          {/* Copy Text */}
                          <button 
                            onClick={() => handleCopyText(msg.text, index)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                            title="Copy Answer"
                          >
                            {copiedIndex === index ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Text content formatted as HTML */}
                  <div 
                    className="markdown-body-formatted"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
                    style={{ fontSize: '0.88rem', color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)', lineHeight: '1.55' }}
                  />

                  {/* Contextual Action Pills (Jump directly into Lab, Explorer, Classroom) */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => handleActionClick(act)}
                          className="action-pill-btn"
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            color: '#e0e7ff',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {act.label}
                          <ExternalLink size={11} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <div style={{
                  padding: '0.8rem 1.25rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'rgba(26, 29, 48, 0.65)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sparkles size={16} style={{ color: 'var(--primary)', animation: 'spin 2s linear infinite' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ChemBot is thinking and formulating reaction steps</span>
                  <div className="typing-dots" style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                    <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                    <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                    <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestion Strip right above input */}
          <div 
            style={{
              padding: '0.45rem 1.25rem',
              background: 'rgba(12, 14, 22, 0.75)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.2rem' }}>Suggestions:</span>
            {QUICK_PROMPTS.slice(0, 4).map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => executeUserPrompt(p.query)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--text-secondary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Interactive Input Form */}
          <form 
            onSubmit={handleSubmit}
            className="chat-input-bar"
            style={{ 
              padding: '0.9rem 1.25rem', 
              borderTop: '1px solid var(--border-color)', 
              background: 'rgba(10, 11, 16, 0.95)', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              position: 'relative'
            }}
          >
            {/* Input Box */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(26, 29, 48, 0.65)',
              border: isRecording ? '1px solid #ef4444' : '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.4rem 0.8rem',
              gap: '0.5rem',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}>
              <Bot size={18} style={{ color: 'var(--primary)' }} />
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening to your voice..." : "Ask any chemistry question, balance an equation, calculate molar mass..."}
                disabled={isTyping}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit'
                }}
              />

              {/* Clear button if text present */}
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                >
                  <X size={14} />
                </button>
              )}

              {/* Voice Input Mic Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  style={{
                    background: isRecording ? '#ef4444' : 'none',
                    border: 'none',
                    color: isRecording ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isRecording ? 'pulse-dots 1s infinite' : 'none'
                  }}
                  title={isRecording ? "Stop voice listening" : "Speak your question"}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
            </div>

            {/* Send Submit Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              style={{
                background: inputText.trim() && !isTyping ? 'linear-gradient(135deg, var(--primary), #4f46e5)' : 'rgba(255,255,255,0.06)',
                color: inputText.trim() && !isTyping ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.1rem',
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
                boxShadow: inputText.trim() && !isTyping ? '0 0 15px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              <span>Send</span>
              <Send size={15} />
            </button>
          </form>

        </div>

      </div>

      {/* Database Explorer Modal (40+ Preloaded Categorized Questions) */}
      {isDatabaseModalOpen && (
        <div 
          className="drawer-overlay"
          onClick={() => setIsDatabaseModalOpen(false)}
          style={{ zIndex: 1000 }}
        >
          <div 
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '680px',
              maxHeight: '80vh',
              margin: 'auto',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'rgba(18, 20, 32, 0.98)',
              border: '1px solid var(--primary-glow)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, fontFamily: 'var(--font-display)' }}>Curated Chemistry Topics (40+)</h3>
              </div>
              <button 
                onClick={() => setIsDatabaseModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-color)', gap: '0.5rem' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={dbSearchQuery}
                onChange={(e) => setDbSearchQuery(e.target.value)}
                placeholder="Search topics by keywords (e.g. acid, alkali, bond, safety)..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
                autoFocus
              />
              {dbSearchQuery && (
                <button onClick={() => setDbSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Modal Question List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
              {Object.keys(activeCategorizedQuestions).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <HelpCircle size={32} style={{ marginBottom: '0.5rem' }} />
                  <p>No questions match your search.</p>
                </div>
              ) : (
                Object.keys(activeCategorizedQuestions).map(catName => {
                  const isCollapsed = collapsedCategories[catName]
                  return (
                    <div key={catName} style={{ marginBottom: '0.75rem' }}>
                      <div 
                        onClick={() => setCollapsedCategories(prev => ({ ...prev, [catName]: !prev[catName] }))}
                        style={{
                          padding: '0.5rem 0.8rem',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                          {catName} ({activeCategorizedQuestions[catName].length})
                        </span>
                        <ChevronDown 
                          size={14} 
                          style={{ 
                            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </div>

                      {!isCollapsed && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.35rem', marginLeft: '0.5rem' }}>
                          {activeCategorizedQuestions[catName].map((qItem, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setIsDatabaseModalOpen(false)
                                executeUserPrompt(qItem.q)
                              }}
                              style={{
                                padding: '0.5rem 0.8rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                color: 'var(--text-primary)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'all 0.15s ease'
                              }}
                              className="dropdown-question-option"
                            >
                              {qItem.q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
