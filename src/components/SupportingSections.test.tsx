import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'

afterEach(cleanup)

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
})
