import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('supporting portfolio sections', () => {
  it('renders three compact projects and honest role qualifiers', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '其他项目' })).toBeVisible()
    expect(screen.getByText('04—06 / SELECTED')).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'RAG Knowledge Base' })).toBeVisible()
    expect(screen.getByText('需求与验收主导，Codex 实现')).toBeVisible()
    expect(screen.getAllByTestId('compact-project')).toHaveLength(3)
  })

  it('exposes direct contact actions without a form', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: '发送邮件' })).toHaveAttribute('href', 'mailto:3230390742@qq.com')
    expect(screen.getByRole('link', { name: '访问 GitHub' })).toHaveAttribute('href', 'https://github.com/3230390742')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('copies the email address when no local mail client is available', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '复制邮箱' }))

    expect(await navigator.clipboard.readText()).toBe('3230390742@qq.com')
    expect(screen.getByRole('status')).toHaveTextContent('邮箱已复制')
  })

  it('shows the address when clipboard permission is denied', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('permission denied'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: '复制邮箱' }))

    expect(screen.getByRole('status')).toHaveTextContent('请手动复制：3230390742@qq.com')
  })
})
