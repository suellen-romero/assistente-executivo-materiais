import { cn } from '../lib/utils.js'

export default function OSToggle({ os, onChange }) {
  return (
    <div className="flex gap-1 mb-4" role="radiogroup" aria-label="Sistema operacional">
      {[
        { id: 'mac', label: 'Mac' },
        { id: 'win', label: 'Windows' },
      ].map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={os === id}
          onClick={() => onChange(id)}
          className={cn(
            'text-[11px] px-3.5 py-1 rounded-2xl font-medium cursor-pointer transition-colors duration-150',
            os === id
              ? 'border border-primary bg-primary-bg text-primary'
              : 'border border-border bg-white text-ink-tertiary hover:border-ink-subtle'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
