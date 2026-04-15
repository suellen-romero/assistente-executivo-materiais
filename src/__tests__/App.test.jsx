import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

describe('App integration', () => {
  it('navigates to module 2 when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    expect(screen.getByRole('heading', { name: /Instalação do assistente/i, level: 2 })).toBeInTheDocument()
  })

  it('typed VPS IP updates dynamic ssh command', async () => {
    const user = userEvent.setup()
    render(<App />)

    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    const input = screen.getByLabelText(/IP da VPS/i)
    await user.type(input, '5.6.7.8')

    // ssh command appears in both "Conectar na VPS" and "Reiniciar o agente" blocks
    expect(screen.getAllByText('ssh root@5.6.7.8').length).toBeGreaterThan(0)
  })

  it('Mac/Windows toggle switches OS-dependent text', async () => {
    const user = userEvent.setup()
    render(<App />)

    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    expect(screen.getByText(/Abra o app Terminal/i)).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /Windows/i }))

    expect(screen.getByText(/Abra o PowerShell/i)).toBeInTheDocument()
  })
})
