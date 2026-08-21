import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'

afterEach(cleanup)

describe('supporting portfolio sections', () => {
  it('renders two compact projects and their evidence qualifiers', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '其他项目' })).toBeVisible()
    expect(screen.getByText('05—06 / SELECTED')).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'RAG Knowledge Base' })).toBeVisible()
    expect(screen.getByText('需求与验收主导，Codex 实现')).toBeVisible()
    const compactProjects = screen.getAllByTestId('compact-project')
    expect(compactProjects).toHaveLength(2)
    expect(within(compactProjects[0]).getByText('内容模型声明')).toBeVisible()
    expect(within(compactProjects[0]).getByText('评测数字来自内容模型声明，本轮未重跑')).toBeVisible()
    expect(within(compactProjects[1]).getAllByText('本轮未重跑')).toHaveLength(2)
  })

  it('exposes direct contact actions without a form', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: '发送邮件' })).toHaveAttribute('href', 'mailto:3230390742@qq.com')
    expect(screen.getByRole('link', { name: '访问 GitHub' })).toHaveAttribute('href', 'https://github.com/3230390742')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })
})
