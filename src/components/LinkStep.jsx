export default function LinkStep({ text, url }) {
  return (
    <div className="flex gap-2 py-1 text-[13px]">
      <span className="text-primary flex-shrink-0 mt-px">›</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link underline hover:no-underline"
      >
        {text}
      </a>
    </div>
  )
}
