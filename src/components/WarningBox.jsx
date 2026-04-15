export default function WarningBox({ text }) {
  return (
    <div className="flex gap-2.5 px-3.5 py-2.5 rounded-lg bg-warning-bg border border-warning-border mb-2">
      <span className="text-sm leading-none" aria-hidden="true">⚠</span>
      <span className="text-[13px] text-warning leading-relaxed">{text}</span>
    </div>
  )
}
