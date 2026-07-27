import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { portfolioData } from '../content/portfolio'
import { FeaturedCaseStudy } from './FeaturedCaseStudy'

afterEach(cleanup)

describe('FeaturedCaseStudy', () => {
  it('renders the narrative, status, results, and evidence', () => {
    const project = portfolioData.featuredProjects[0]
    const image = project.visuals.find((visual) => visual.kind === 'image')
    if (!image) throw new Error('Expected an image visual')

    render(<FeaturedCaseStudy project={project} index={0} />)

    expect(screen.getByRole('heading', { name: project.title })).toBeVisible()
    expect(screen.getByText(project.status)).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 4 })).not.toHaveLength(0)
    expect(screen.getByText(project.results[2].value)).toBeVisible()
    expect(screen.getByRole('button', { name: new RegExp(image.caption) })).toBeVisible()
  })

  it('renders an evidence view instead of fake terminal media', () => {
    const project = portfolioData.featuredProjects[1]
    const evidence = project.visuals.find((visual) => visual.kind === 'evidence')
    if (!evidence) throw new Error('Expected an evidence visual')

    render(<FeaturedCaseStudy project={project} index={1} />)

    expect(screen.getByRole('figure', { name: evidence.title })).toBeVisible()
    expect(screen.getByText(evidence.lines[2])).toBeVisible()
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
