import { describe, expect, it } from 'vitest'
import { agentReplay } from './agentReplay'
import { portfolioData } from './portfolio'
import type { EvidenceLabel } from './types'

const evidenceLabel: EvidenceLabel = '本地代码验证'

describe('portfolioData', () => {
  it('publishes the required featured and compact project shapes', () => {
    expect(evidenceLabel).toBe('本地代码验证')
    expect(portfolioData.featuredProjects.map((project) => project.id)).toEqual([
      'personal-rag',
      'local-agent-mcp',
      'ai-ui-regression',
      'birthday-site',
    ])
    expect(portfolioData.compactProjects).toHaveLength(2)

    for (const project of portfolioData.featuredProjects) {
      expect(project.verification.source).toBeTruthy()
    }

    for (const project of portfolioData.featuredProjects) {
      for (const metric of project.results) {
        expect(metric.source).toBeTruthy()
        expect(metric.note).toBeTruthy()
      }
    }

    for (const project of portfolioData.featuredProjects) {
      expect(project.demoUrl ?? '').not.toContain('www.mohaiqing.top')
    }

    for (const project of portfolioData.compactProjects) {
      expect(project.resultSource).toBeTruthy()
      expect(project.resultNote).toBeTruthy()
    }
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

  it('avoids prohibited public claims while allowing undeployed status text', () => {
    const publicJson = JSON.stringify(portfolioData)
    const prohibitedClaims = [
      ['本地不', '存在 ', 'Personal RAG'].join(''),
      ['F1=1.0 ', '已通过'].join(''),
      ['Fresh ', '验证'].join(''),
      ['测试', '通过'].join(''),
      ['交付 ', 'Windows 安装器'].join(''),
    ]

    for (const claim of prohibitedClaims) {
      expect(publicJson).not.toContain(claim)
    }

    expect(publicJson).not.toContain('交付 React + FastAPI 桌面应用与 Windows 安装器')

    for (const project of portfolioData.featuredProjects) {
      expect(project.demoUrl ?? '').not.toContain('www.mohaiqing.top')
    }
  })

  it('keeps the approved public identity and contact links', () => {
    expect(portfolioData.person.name).toBe('磨海清')
    expect(portfolioData.person.githubUrl).toBe('https://github.com/3230390742')
    expect(portfolioData.person.resumeUrl).toBe('/resume/磨海清_AI应用工程实习简历.pdf')
    expect('email' in portfolioData.person).toBe(false)
    expect(portfolioData.heroMetrics.map((metric) => metric.label)).toEqual([
      '项目案例',
      '重点案例',
      'MCP 测试记录',
      '核心方向',
    ])
  })

  it('publishes the audited Agent replay totals without stale counters', () => {
    const project = portfolioData.featuredProjects.find((item) => item.id === 'local-agent-mcp')

    expect(project?.results).toEqual(expect.arrayContaining([
      {
        value: `${agentReplay.verification.testFilesPassed}/${agentReplay.verification.testFilesTotal}`,
        label: '测试文件记录',
        source: '历史运行产物',
        note: '本轮未重跑',
      },
      {
        value: `${agentReplay.verification.testsPassed}/${agentReplay.verification.testsTotal}`,
        label: '测试记录',
        source: '历史运行产物',
        note: '本轮未重跑',
      },
    ]))
    expect(portfolioData.heroMetrics).toContainEqual({
      value: `${agentReplay.verification.testsPassed}/${agentReplay.verification.testsTotal}`,
      label: 'MCP 测试记录',
      source: '历史运行产物',
      note: '本轮未重跑',
    })
  })

  it('keeps compact project provenance split between project and result levels', () => {
    expect(portfolioData.compactProjects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'rag-knowledge-base',
        source: '公开仓库验证',
        verificationNote: '评测数字来自内容模型声明，本轮未重跑',
        resultSource: '内容模型声明',
        resultNote: '本轮未重跑',
      }),
      expect.objectContaining({
        id: 'codex-project-memory',
        source: '内容模型声明',
        verificationNote: '本轮未重跑',
        resultSource: '内容模型声明',
        resultNote: '本轮未重跑',
      }),
    ]))
  })
})
