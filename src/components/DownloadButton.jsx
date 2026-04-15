export default function DownloadButton({ label, file, desc }) {
  // Use Vite's BASE_URL so paths work on GH Pages
  const href = `${import.meta.env.BASE_URL}downloads/${file}`

  return (
    <a
      href={href}
      download={file}
      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border-[1.5px] border-primary mb-2.5 cursor-pointer transition-colors duration-150 hover:bg-primary-bg no-underline"
      aria-label={`Baixar ${label}`}
    >
      <div className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D63027" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-primary">{label}</div>
        {desc && <div className="text-[11px] text-ink-subtle mt-px">{desc}</div>}
      </div>
      <div className="text-[11px] text-ink-tertiary flex-shrink-0">{file}</div>
    </a>
  )
}
