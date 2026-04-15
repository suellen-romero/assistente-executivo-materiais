import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommandDynamicBlock from '../components/CommandDynamicBlock.jsx'

describe('CommandDynamicBlock', () => {
  it('renders fallback when input is empty', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="ssh root@{vps_ip}"
        fb="ssh root@SEU_IP"
        req="vps_ip"
        inputs={{}}
      />
    )
    expect(screen.getByText('ssh root@SEU_IP')).toBeInTheDocument()
  })

  it('replaces placeholder when input is filled', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="ssh root@{vps_ip}"
        fb="ssh root@SEU_IP"
        req="vps_ip"
        inputs={{ vps_ip: '1.2.3.4' }}
      />
    )
    expect(screen.getByText('ssh root@1.2.3.4')).toBeInTheDocument()
  })

  it('replaces multiple occurrences of the same placeholder', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="echo {ip} && ping {ip}"
        fb="echo IP && ping IP"
        req="ip"
        inputs={{ ip: '9.9.9.9' }}
      />
    )
    expect(screen.getByText('echo 9.9.9.9 && ping 9.9.9.9')).toBeInTheDocument()
  })
})
