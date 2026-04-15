import { useId } from 'react'

export default function InputField({ label, placeholder, keyName, value, onChange }) {
  const id = useId()
  return (
    <div className="flex gap-2 items-center py-1.5 flex-wrap">
      <label
        htmlFor={id}
        className="text-[12px] text-ink-subtle min-w-[130px] font-medium"
      >
        {label}:
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(keyName, e.target.value)}
        className="flex-1 min-w-[200px] h-[34px] border border-border rounded-md px-2.5 text-[12px] font-mono bg-code text-ink outline-none focus-visible:border-link"
      />
      <span className="text-[9px] text-border">não armazenado</span>
    </div>
  )
}
