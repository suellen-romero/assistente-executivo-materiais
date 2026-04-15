import { useState } from 'react'
import { cn } from '../lib/utils.js'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border font-medium whitespace-nowrap cursor-pointer transition-colors duration-200',
        copied
          ? 'border-success bg-success-bg text-success'
          : 'border-border bg-white text-ink-subtle hover:border-ink-subtle'
      )}
      aria-label={copied ? 'Comando copiado' : 'Copiar comando'}
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}
