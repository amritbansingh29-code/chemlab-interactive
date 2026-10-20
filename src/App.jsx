import { useState } from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import { Home, Compass, FlaskConical, GraduationCap, HelpCircle, User, MessageSquare, Bot } from 'lucide-react'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import VirtualLabPage from './pages/VirtualLabPage'
import ClassroomPage from './pages/ClassroomPage'
import QuizPage from './pages/QuizPage'
import AssistantPage from './pages/AssistantPage'


export default function App() {
  
  const location = useLocation()

  // Lifted states to share context across pages
  const [selectedExploreElement, setSelectedExploreElement] = useState(null)
  const [labLeftElement, setLabLeftElement] = useState(null)
  const [labRightElement, setLabRightElement] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)


  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 5h20c0-2-1-3.75-2.5-5M12 2v10M8 8l4-4 4 4" />
            <path d="M6 12h12M9 16h6" />
          </svg>
          <div>
            <h1 className="brand-title">ChemLab Interactive</h1>
            <span className="brand-subtitle">Explore • Virtual Lab • Classroom</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <NavLink to="/" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`} end>
            <Home size={16} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`}>
            <Compass size={16} />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/virtual-lab" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`}>
            <FlaskConical size={16} />
            <span>Virtual Lab</span>
          </NavLink>
          <NavLink to="/classroom" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`}>
            <GraduationCap size={16} />
            <span>Classroom</span>
          </NavLink>
          
          <NavLink to="/quiz" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`}>
            <HelpCircle size={16} />
            <span>Quiz</span>
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => `tab-btn${isActive ? ' active' : ''}`}>
            <Bot size={16} style={{ color: 'var(--primary)' }} />
            <span>ChemBot AI</span>
            <span className="nav-ai-badge">FREE</span>
          </NavLink>
        </nav>

        <div className="profile-pill">
          <User size={14} className="profile-icon" />
          <span>student_chem_2026</span>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/explore" 
            element={
              <ExplorePage 
                selectedElement={selectedExploreElement} 
                setSelectedElement={setSelectedExploreElement} 
                onLoadLeft={setLabLeftElement}
                onLoadRight={setLabRightElement}
              />
            } 
          />
          <Route 
            path="/virtual-lab" 
            element={
              <VirtualLabPage 
                leftEl={labLeftElement} 
                setLeftEl={setLabLeftElement} 
                rightEl={labRightElement} 
                setRightEl={setLabRightElement} 
              />
            } 
          />
          <Route 
            path="/classroom" 
            element={
              <ClassroomPage 
                activeVideo={activeVideo} 
                setActiveVideo={setActiveVideo} 
              />
            } 
          />
          <Route 
            path="/quiz" 
            element={
                <QuizPage />
            } 
          />
          <Route 
            path="/assistant" 
            element={
              <AssistantPage 
                onLoadLeft={setLabLeftElement}
                onLoadRight={setLabRightElement}
                setSelectedElement={setSelectedExploreElement}
              />
            } 
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      
    </div>
  )
}

