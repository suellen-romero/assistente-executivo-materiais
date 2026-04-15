export default function LessonCard({ title, desc }) {
  return (
    <div className="px-4 py-3.5 mb-1.5 rounded-[10px] border border-border-soft bg-white">
      <div className="text-[14px] font-semibold text-ink mb-0.5">{title}</div>
      <div className="text-[12px] text-ink-subtle leading-snug">{desc}</div>
    </div>
  )
}
