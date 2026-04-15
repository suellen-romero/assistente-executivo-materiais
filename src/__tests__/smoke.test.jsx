import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App', () => {
  it('renders header and first module', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /Materiais de apoio/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Bem-vinda e contexto/i })).toBeInTheDocument()
  })
})
