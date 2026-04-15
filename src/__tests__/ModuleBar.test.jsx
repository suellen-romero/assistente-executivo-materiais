import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuleBar from '../components/ModuleBar.jsx'

const modules = [
  { id: 1, icon: '1', title: 'Intro' },
  { id: 2, icon: '2', title: 'Install' },
  { id: 3, icon: '3', title: 'Security' },
]

describe('ModuleBar', () => {
  it('renders all module buttons (desktop)', () => {
    render(<ModuleBar modules={modules} activeId={1} onChange={() => {}} />)
    expect(screen.getAllByRole('button', { name: /Intro/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /Install/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /Security/ }).length).toBeGreaterThan(0)
  })

  it('calls onChange with clicked module id', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ModuleBar modules={modules} activeId={1} onChange={onChange} />)

    const buttons = screen.getAllByRole('button', { name: /Install/ })
    await user.click(buttons[0])
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
