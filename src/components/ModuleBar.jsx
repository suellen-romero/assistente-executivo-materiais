import { useState, useEffect } from 'react'
import { cn } from '../lib/utils.js'

export default function ModuleBar({ modules, activeId, onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = modules.find(m => m.id === activeId)

  // Close mobile dropdown when module changes
  useEffect(() => {
    setMobileOpen(false)
  }, [activeId])

  return (
    <>
      {/* Desktop: horizontal bar */}
      <div className="hidden md:flex gap-1 mb-5 overflow-x-auto pb-1">
        {modules.map((m) => {
          const isActive = m.id === activeId
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              title={m.title}
              aria-label={`Módulo ${m.icon}: ${m.title}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'min-w-[40px] h-9 rounded-md font-display text-[15px] cursor-pointer flex-shrink-0 transition-colors duration-150 flex items-center justify-center',
                isActive
                  ? 'border-2 border-primary bg-primary-bg text-primary'
                  : 'border border-border bg-white text-ink-tertiary hover:border-ink-subtle'
              )}
            >
              {m.icon}
            </button>
          )
        })}
      </div>

      {/* Mobile: dropdown */}
      <div className="md:hidden mb-5 relative">
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          aria-expanded={mobileOpen}
          aria-haspopup="listbox"
          aria-label={`Módulo ${active?.icon}: ${active?.title}`}
          className="w-full flex justify-between items-center px-4 py-2.5 rounded-md border border-primary bg-primary-bg text-primary font-semibold text-[13px] cursor-pointer"
        >
          <span>
            <span className="font-display text-[17px] mr-2">{active?.icon}</span>
            {active?.title}
          </span>
          <span aria-hidden="true">{mobileOpen ? '▴' : '▾'}</span>
        </button>
        {mobileOpen && (
          <ul
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-[60vh] overflow-y-auto"
          >
            {modules.map((m) => {
              const isActive = m.id === activeId
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-label={`Módulo ${m.icon}: ${m.title}`}
                    aria-selected={isActive}
                    onClick={() => onChange(m.id)}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-[13px] cursor-pointer flex items-center gap-2.5 transition-colors',
                      isActive
                        ? 'bg-primary-bg text-primary font-semibold'
                        : 'text-ink-muted hover:bg-code'
                    )}
                  >
                    <span className="font-display text-[15px] min-w-[28px] inline-block text-center">{m.icon}</span>
                    <span>{m.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
