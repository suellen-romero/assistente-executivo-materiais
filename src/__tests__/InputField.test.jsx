import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputField from '../components/InputField.jsx'

describe('InputField', () => {
  it('calls onChange with (key, value) when typing', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<InputField label="IP" placeholder="x" keyName="vps_ip" value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('x')
    await user.type(input, 'a')

    expect(onChange).toHaveBeenCalledWith('vps_ip', 'a')
  })

  it('displays the current value', () => {
    render(<InputField label="IP" placeholder="x" keyName="vps_ip" value="1.2.3.4" onChange={() => {}} />)
    expect(screen.getByDisplayValue('1.2.3.4')).toBeInTheDocument()
  })

  it('associates label with input for a11y', () => {
    render(<InputField label="IP da VPS" placeholder="x" keyName="vps_ip" value="" onChange={() => {}} />)
    expect(screen.getByLabelText(/IP da VPS/i)).toBeInTheDocument()
  })
})
