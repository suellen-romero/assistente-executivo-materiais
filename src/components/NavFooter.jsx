export default function NavFooter({ activeId, totalCount, onPrev, onNext }) {
  const hasPrev = activeId > 1
  const hasNext = activeId < totalCount

  return (
    <nav className="flex justify-between mt-6 pt-4 border-t border-border-soft">
      {hasPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="text-[13px] text-primary font-medium cursor-pointer bg-transparent border-0 p-0 hover:underline"
        >
          ← Anterior
        </button>
      ) : <div />}
      {hasNext ? (
        <button
          type="button"
          onClick={onNext}
          className="text-[13px] text-primary font-medium cursor-pointer bg-transparent border-0 p-0 hover:underline"
        >
          Próximo →
        </button>
      ) : <div />}
    </nav>
  )
}
