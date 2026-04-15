import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CopyButton from '../components/CopyButton.jsx'

describe('CopyButton', () => {
  it('shows "Copiar" initially', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument()
  })

  it('copies text to clipboard and switches to "Copiado" on click', async () => {
    // userEvent.setup() provides a clipboard in its own writeable "user session"
    const user = userEvent.setup()
    render(<CopyButton text="my-command" />)

    await user.click(screen.getByRole('button', { name: /copiar/i }))

    // Verify user-facing state changed
    expect(screen.getByRole('button', { name: /copiado/i })).toBeInTheDocument()
    // Verify the clipboard actually received the text
    const clip = await navigator.clipboard.readText()
    expect(clip).toBe('my-command')
  })

  it('stays on "Copiado" state permanently after click (no timer reset)', async () => {
    const user = userEvent.setup()
    render(<CopyButton text="x" />)
    await user.click(screen.getByRole('button'))

    // Wait longer than any plausible reset timer
    await new Promise(r => setTimeout(r, 100))

    expect(screen.getByRole('button', { name: /copiado/i })).toBeInTheDocument()
  })
})
