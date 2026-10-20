import { queryLocalChemEngine, balanceEquation, calculateMolarMass } from './chemLocalEngine.js'
import { elements } from '../data/elements.js'
import { compounds } from '../data/compounds.js'

const SYSTEM_PROMPT = `You are ChemBot AI, the intelligent artificial intelligence tutor and laboratory assistant inside the ChemLab Interactive web application.
Your mission is to teach chemistry clearly, guide students through experiments, explain mechanisms, balance chemical equations, calculate stoichiometry, and uphold laboratory safety.

GUIDELINES:
1. Explain chemical concepts accurately, clearly, and engagingly.
2. Format chemical formulas and math using LaTeX or standard notation (e.g. $$2\\text{Na} + 2\\text{H}_2\\text{O} \\longrightarrow 2\\text{NaOH} + \\text{H}_2\\uparrow$$ or $PV = nRT$).
3. When describing reactive or dangerous chemicals (e.g., concentrated acids, alkali metals, toxic vapors), ALWAYS include a concise safety precaution or PPE requirement.
4. Format your responses with structured Markdown: headings (###), bold terms, bullet points, and tables where applicable.
5. If the reaction discussed can be tested on our 2-tube reaction bench, include an action tag at the end like: [LAB: Reactant1, Reactant2] (e.g. [LAB: Na, H2O] or [LAB: HCl, NaOH]).
6. If the question is about a specific element, include: [EXPLORE: Symbol] (e.g. [EXPLORE: Au] or [EXPLORE: Fe]).
7. Keep responses concise, educational, and high-impact.`

// Available free AI modes
export const AI_MODES = [
  { id: 'auto', name: 'Auto (Cloud AI + Local Fallback)', description: 'Free Cloud AI with instant offline backup' },
  { id: 'cloud', name: 'Cloud AI (GPT-4o mini)', description: 'Free online neural reasoning (No API key)' },
  { id: 'local', name: 'Instant Local Engine (0ms)', description: 'Runs 100% in your browser without internet' }
]

const allReactants = [...elements, ...compounds]
const findReactantBySymbol = (sym) => allReactants.find(r => r.symbol.toLowerCase() === sym.trim().toLowerCase()) || null

// Parse action tags from AI text
export function parseActionTags(rawText) {
  let cleanedText = rawText
  const actions = []

  // Match [LAB: X, Y]
  const labRegex = /\[LAB:\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\]/gi
  let labMatch
  while ((labMatch = labRegex.exec(rawText)) !== null) {
    const leftSym = labMatch[1].trim()
    const rightSym = labMatch[2].trim()
    const leftObj = findReactantBySymbol(leftSym)
    const rightObj = findReactantBySymbol(rightSym)
    if (leftObj && rightObj) {
      actions.push({
        label: `⚡ Test ${leftSym} + ${rightSym} in Lab`,
        type: 'lab',
        left: leftObj.symbol,
        right: rightObj.symbol
      })
    }
  }
  cleanedText = cleanedText.replace(labRegex, '')

  // Match [EXPLORE: X]
  const exploreRegex = /\[EXPLORE:\s*([A-Za-z0-9]+)\s*\]/gi
  let expMatch
  while ((expMatch = exploreRegex.exec(rawText)) !== null) {
    const sym = expMatch[1].trim()
    const obj = findReactantBySymbol(sym)
    if (obj) {
      actions.push({
        label: `🔍 View ${obj.name} (${obj.symbol}) in Explorer`,
        type: 'explore',
        symbol: obj.symbol
      })
    }
  }
  cleanedText = cleanedText.replace(exploreRegex, '')

  // Match [CLASSROOM]
  if (/\[CLASSROOM\]/i.test(rawText)) {
    actions.push({
      label: '📖 Open Video Classroom',
      type: 'classroom'
    })
    cleanedText = cleanedText.replace(/\[CLASSROOM\]/gi, '')
  }

  return {
    cleanedText: cleanedText.trim(),
    actions
  }
}

// Fetch from Pollinations AI (100% Free, No Key Required)
async function fetchPollinationsAI(prompt, conversationHistory = []) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ]

  // Add recent conversation history (last 4 messages for context)
  if (conversationHistory && conversationHistory.length > 0) {
    const recent = conversationHistory.slice(-4)
    recent.forEach(m => {
      messages.push({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })
    })
  }

  messages.push({ role: 'user', content: prompt })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 16000) // 16 second timeout

  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 100000)
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const text = await response.text()
    if (!text || text.trim().length === 0 || text.includes('<!DOCTYPE html>') || text === '{}') {
      throw new Error('Empty or invalid response from AI endpoint')
    }

    return text
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

// Main ChemBot Message Handler
export async function sendChemBotMessage(prompt, conversationHistory = [], preferredMode = 'auto') {
  const cleanPrompt = prompt.trim()
  const lowerPrompt = cleanPrompt.toLowerCase()

  // 1. Check if user explicitly asked for Local Only
  if (preferredMode === 'local') {
    const localResult = queryLocalChemEngine(cleanPrompt)
    return {
      text: localResult.text,
      actions: localResult.actions || [],
      source: 'local',
      modelBadge: '⚡ Instant Offline Engine (0ms)'
    }
  }

  // 2. High-precision math/balancing check:
  // If the user is asking to balance an equation or calculate molar mass, our local engine
  // provides 100% mathematically exact tables with conservation-of-mass proof!
  if (
    lowerPrompt.startsWith('balance ') || 
    lowerPrompt.startsWith('molar mass of ') || 
    lowerPrompt.startsWith('molecular weight of ')
  ) {
    const localResult = queryLocalChemEngine(cleanPrompt)
    if (localResult && localResult.category !== 'General Chemistry Help') {
      return {
        text: localResult.text,
        actions: localResult.actions || [],
        source: 'local-exact',
        modelBadge: '⚡ High-Precision Calculation Engine'
      }
    }
  }

  // 3. Cloud Free AI (Pollinations.ai)
  try {
    const rawAiText = await fetchPollinationsAI(cleanPrompt, conversationHistory)
    const { cleanedText, actions } = parseActionTags(rawAiText)

    // Augment with local contextual action suggestions if none were detected
    let finalActions = actions
    if (finalActions.length === 0) {
      const localCheck = queryLocalChemEngine(cleanPrompt)
      if (localCheck && localCheck.actions && localCheck.actions.length > 0) {
        finalActions = localCheck.actions
      }
    }

    return {
      text: cleanedText,
      actions: finalActions,
      source: 'cloud',
      modelBadge: '✨ Free Cloud AI (GPT-4o mini)'
    }
  } catch {
    // 4. Seamless Fallback to Local Engine — 100% resilient, zero error messages!
    const localResult = queryLocalChemEngine(cleanPrompt)
    return {
      text: localResult.text,
      actions: localResult.actions || [],
      source: 'local-fallback',
      modelBadge: '⚡ Instant Offline Engine (Active)'
    }
  }
}
