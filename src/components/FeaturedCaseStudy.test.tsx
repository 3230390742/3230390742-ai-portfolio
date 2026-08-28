import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { portfolioData } from '../content/portfolio'
import { FeaturedCaseStudy } from './FeaturedCaseStudy'

afterEach(cleanup)

describe('FeaturedCaseStudy', () => {
  it('marks the project for cinematic styling and only prioritizes the first cover', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const first = portfolioData.featuredProjects[0]
    const third = portfolioData.featuredProjects[2]
    const firstRender = render(<FeaturedCaseStudy project={first} index={0} />)

    expect(firstRender.container.querySelector('article')).toHaveAttribute('data-project', 'personal-rag')
    expect(firstRender.container.querySelector('img')).toHaveAttribute('loading', 'eager')

    firstRender.unmount()
    const laterRender = render(<FeaturedCaseStudy project={third} index={2} />)

    expect(laterRender.container.querySelectorAll('img')[0]).toHaveAttribute('loading', 'lazy')
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('renders the narrative, status, results, and evidence', () => {
    const project = portfolioData.featuredProjects[0]
    const image = project.visuals.find((visual) => visual.kind === 'image')
    if (!image) throw new Error('Expected an image visual')

    const { container } = render(<FeaturedCaseStudy project={project} index={0} />)

    expect(screen.getByRole('heading', { name: project.title })).toBeVisible()
    expect(screen.getByText(project.status)).toBeVisible()
    expect(screen.getByText('本地代码验证')).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 4 })).not.toHaveLength(0)
    expect(screen.getByText(project.results[2].value)).toBeVisible()
    expect(screen.getAllByText('本轮未独立运行')[0]).toBeVisible()
    expect(screen.getByRole('button', { name: new RegExp(image.caption) })).toBeVisible()
    expect(container.querySelectorAll('dl p')).toHaveLength(0)
  })

  it('renders the audited Agent replay controls and real source link', () => {
    const project = portfolioData.featuredProjects.find((item) => item.id === 'local-agent-mcp')
    if (!project) throw new Error('Expected the Local Agent MCP project')

    render(<FeaturedCaseStudy project={project} index={portfolioData.featuredProjects.indexOf(project)} />)

    expect(screen.getByRole('tab', { name: '运行控制台' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Agent 对比' })).toBeVisible()
    expect(screen.getByRole('tab', { name: '安全审计' })).toBeVisible()
    expect(screen.getByRole('link', { name: '查看源码' })).toHaveAttribute(
      'href',
      'https://github.com/3230390742/local-agent-mcp',
    )
  })

  it('shows a stable text fallback when a project image cannot load', () => {
    const project = portfolioData.featuredProjects[0]
    const image = project.visuals.find((visual) => visual.kind === 'image')
    if (!image) throw new Error('Expected an image visual')

    render(<FeaturedCaseStudy project={project} index={0} />)

    fireEvent.error(screen.getByAltText(image.alt))

    expect(screen.getByRole('img', { name: `${image.caption}加载失败` })).toBeVisible()
  })
})
