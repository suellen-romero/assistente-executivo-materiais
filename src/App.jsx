import { useState, useCallback } from 'react'
import { MODULES, PHASES } from './data/modules.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ModuleBar from './components/ModuleBar.jsx'
import ModuleHeader from './components/ModuleHeader.jsx'
import OSToggle from './components/OSToggle.jsx'
import Block from './components/Block.jsx'
import LessonCard from './components/LessonCard.jsx'
import NavFooter from './components/NavFooter.jsx'

export default function App() {
  const [activeId, setActiveId] = useState(1)
  const [os, setOs] = useState('mac')
  const [inputs, setInputs] = useState({})

  const setInput = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const module = MODULES.find(m => m.id === activeId)
  const phase = PHASES.find(p => p.id === module.phase)
  const isBlocks = module.content.type === 'blocks'

  const goTo = (id) => {
    setActiveId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-content mx-auto p-4">
      <Header />

      <ModuleBar modules={MODULES} activeId={activeId} onChange={goTo} />

      <ModuleHeader module={module} phase={phase} />

      {isBlocks && <OSToggle os={os} onChange={setOs} />}

      {isBlocks
        ? module.content.blocks.map((b, i) => (
            <Block key={i} block={b} idx={i} os={os} inputs={inputs} setInput={setInput} />
          ))
        : module.content.lessons.map((l, i) => (
            <LessonCard key={i} title={l.title} desc={l.desc} />
          ))
      }

      <NavFooter
        activeId={activeId}
        totalCount={MODULES.length}
        onPrev={() => goTo(activeId - 1)}
        onNext={() => goTo(activeId + 1)}
      />

      <Footer />
    </div>
  )
}
