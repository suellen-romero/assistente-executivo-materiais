import CopyButton from './CopyButton.jsx'
import { cn } from '../lib/utils.js'

export default function CommandDynamicBlock({ label, tpl, fb, req, inputs }) {
  const value = inputs[req]
  const cmd = value ? tpl.replace(new RegExp(`\\{${req}\\}`, 'g'), value) : fb
  const filled = Boolean(value)

  return (
    <div className="rounded-lg border border-border-soft overflow-hidden mb-2">
      <div className="flex justify-between items-center px-3 py-1.5 bg-code border-b border-border-soft">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <CopyButton text={cmd} />
      </div>
      <pre
        className={cn(
          'm-0 px-3 py-2.5 text-[12px] bg-white overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed',
          filled ? 'text-success' : 'text-primary'
        )}
      >
        {cmd}
      </pre>
    </div>
  )
}
