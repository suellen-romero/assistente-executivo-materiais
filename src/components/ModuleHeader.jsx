export default function ModuleHeader({ module, phase }) {
  return (
    <div className="relative mb-4 min-h-[80px]">
      <span
        aria-hidden="true"
        className="absolute -top-6 right-0 text-[120px] leading-none font-display text-primary-bg select-none pointer-events-none z-0"
      >
        {module.icon}
      </span>
      <div className="relative z-10">
        <div className="inline-block text-[10px] font-semibold uppercase tracking-[1.5px] text-primary bg-primary-bg px-2.5 py-0.5 rounded mb-1.5">
          {phase?.label}
        </div>
        <h2 className="font-display text-[28px] tracking-wide text-ink m-0 leading-tight">
          {module.title}
        </h2>
        {module.content.desc && (
          <p className="text-[13px] text-ink-subtle mt-1 mb-0 leading-snug">
            {module.content.desc}
          </p>
        )}
      </div>
    </div>
  )
}
