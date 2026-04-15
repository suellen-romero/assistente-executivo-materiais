import CommandBlock from './CommandBlock.jsx'
import CommandDynamicBlock from './CommandDynamicBlock.jsx'
import InputField from './InputField.jsx'
import DownloadButton from './DownloadButton.jsx'
import WarningBox from './WarningBox.jsx'
import InfoStep from './InfoStep.jsx'
import InfoOSStep from './InfoOSStep.jsx'
import LinkStep from './LinkStep.jsx'

export default function Block({ block, idx, os, inputs, setInput }) {
  return (
    <section className="mb-4 p-4 rounded-[10px] border border-border-soft bg-white">
      <header className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-semibold bg-primary-bg text-primary">
          {idx + 1}
        </div>
        <h3 className="text-[15px] font-semibold text-ink m-0">{block.title}</h3>
      </header>
      <div>
        {block.steps.map((s, i) => {
          switch (s.type) {
            case 'command':
              return <CommandBlock key={i} label={s.label} cmd={s.cmd} note={s.note} />
            case 'command_dynamic':
              return <CommandDynamicBlock key={i} label={s.label} tpl={s.tpl} fb={s.fb} req={s.req} inputs={inputs} />
            case 'warning':
              return <WarningBox key={i} text={s.text} />
            case 'info_os':
              return <InfoOSStep key={i} mac={s.mac} win={s.win} os={os} />
            case 'input':
              return (
                <InputField
                  key={i}
                  label={s.label}
                  placeholder={s.placeholder}
                  keyName={s.key}
                  value={inputs[s.key] || ''}
                  onChange={setInput}
                />
              )
            case 'download':
              return <DownloadButton key={i} label={s.label} file={s.file} desc={s.desc} />
            case 'link':
              return <LinkStep key={i} text={s.text} url={s.url} />
            case 'info':
            default:
              return <InfoStep key={i} text={s.text} />
          }
        })}
      </div>
    </section>
  )
}
