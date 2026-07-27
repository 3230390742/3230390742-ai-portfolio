import { describe, expect, it } from 'vitest'
import { portfolioData } from './portfolio'

describe('portfolioData', () => {
  it('publishes exactly three featured and three compact projects', () => {
    expect(portfolioData.featuredProjects).toHaveLength(3)
    expect(portfolioData.compactProjects).toHaveLength(3)
  })

  it('uses unique public IDs and complete featured narratives', () => {
    const projects = [...portfolioData.featuredProjects, ...portfolioData.compactProjects]
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length)
    for (const project of portfolioData.featuredProjects) {
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.decisions.length).toBeGreaterThan(0)
      expect(project.implementation.length).toBeGreaterThan(0)
      expect(project.results.length).toBeGreaterThan(0)
      expect(project.visuals.length).toBeGreaterThan(0)
    }
  })

  it('contains no private paths, source IDs, or credential-shaped text', () => {
    const publicJson = JSON.stringify(portfolioData)
    expect(publicJson).not.toMatch(/[A-Z]:\\|\/Users\/|repo:|doc:|runtime:/i)
    expect(publicJson).not.toMatch(/api[_-]?key|password|cookie|secret/i)
  })

  it('keeps the approved public identity and contact links', () => {
    expect(portfolioData.person.name).toBe('磨海清')
    expect(portfolioData.person.email).toBe('3230390742@qq.com')
    expect(portfolioData.person.githubUrl).toBe('https://github.com/3230390742')
    expect(portfolioData.person.resumeUrl).toBe('/resume/磨海清_AI应用工程实习简历.pdf')
  })
})
