import CopyButton from './CopyButton.jsx'

export default function CommandBlock({ label, cmd, note }) {
  return (
    <div className="rounded-lg border border-border-soft overflow-hidden mb-2">
      <div className="flex justify-between items-center px-3 py-1.5 bg-code border-b border-border-soft">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <CopyButton text={cmd} />
      </div>
      <pre className="m-0 px-3 py-2.5 text-[12px] text-primary bg-white overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">{cmd}</pre>
      {note && (
        <div className="px-3 py-1.5 text-[11px] text-ink-tertiary italic border-t border-border-soft">{note}</div>
      )}
    </div>
  )
}
