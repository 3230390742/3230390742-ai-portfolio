import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { agentReplay } from '../content/agentReplay'
import { AgentMcpReplay } from './AgentMcpReplay'

afterEach(cleanup)

describe('AgentMcpReplay', () => {
  it('shows the fixed run, comparison, and audit views', async () => {
    const user = userEvent.setup()
    render(<AgentMcpReplay replay={agentReplay} />)

    expect(screen.getByRole('region', { name: 'Local Agent MCP 历史运行回放' })).toBeVisible()
    expect(screen.getByText('历史运行回放')).toBeVisible()
    expect(screen.queryByText('已验证运行回放')).not.toBeInTheDocument()
    expect(screen.getByText('HISTORICAL RECORD')).toBeVisible()
    expect(screen.queryByText('SYSTEM READY')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '运行控制台' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('realpath allowlist')).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Agent 对比' }))
    expect(screen.getByRole('heading', { name: 'Codex' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'OpenCode' })).toBeVisible()
    expect(screen.queryByText(/谁更好|winner|score/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '安全审计' }))
    expect(screen.getByText('历史运行产物')).toBeVisible()
    expect(screen.getByText('历史测试记录')).toBeVisible()
    expect(screen.getByText('PUBLICATION_OK')).toBeVisible()
    expect(screen.getByText(`${agentReplay.verification.testsPassed}/${agentReplay.verification.testsTotal}`)).toBeVisible()
  })

  it('moves selection and focus with horizontal arrow keys', async () => {
    const user = userEvent.setup()
    render(<AgentMcpReplay replay={agentReplay} />)
    const run = screen.getByRole('tab', { name: '运行控制台' })

    run.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Agent 对比' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Agent 对比' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(run).toHaveFocus()
    expect(run).toHaveAttribute('aria-selected', 'true')
  })

  it('connects each tab to its labelled tabpanel', () => {
    render(<AgentMcpReplay replay={agentReplay} />)

    for (const label of ['运行控制台', 'Agent 对比', '安全审计']) {
      const tab = screen.getByRole('tab', { name: label })
      const panelId = tab.getAttribute('aria-controls')
      expect(panelId).toBeTruthy()
      const panel = document.getElementById(panelId!)
      expect(panel).toHaveAttribute('role', 'tabpanel')
      expect(panel).toHaveAttribute('aria-labelledby', tab.id)
    }
  })
})
