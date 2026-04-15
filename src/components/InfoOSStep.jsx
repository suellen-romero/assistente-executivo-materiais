export default function InfoOSStep({ mac, win, os }) {
  return (
    <div className="flex gap-2 py-1 text-[13px] text-ink-soft leading-relaxed">
      <span className="text-primary flex-shrink-0 mt-px">›</span>
      <span>{os === 'mac' ? mac : win}</span>
    </div>
  )
}
