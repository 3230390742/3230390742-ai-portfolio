// @vitest-environment node
/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('static metadata for IP deployment', () => {
  const html = readFileSync('index.html', 'utf8')
  const robots = readFileSync('public/robots.txt', 'utf8')

  it('keeps public identity without publishing a stale canonical host', () => {
    expect(html).toContain('<title>磨海清｜AI 应用工程作品集</title>')
    expect(html).toContain('/og-portfolio.png')
    expect(html).not.toContain('3230390742-ai-portfolio.vercel.app')
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('mailto:')
    expect(robots).not.toContain('Sitemap:')
    expect(existsSync('public/sitemap.xml')).toBe(false)
  })

  it('contains Person and CreativeWork structured data', () => {
    expect(html).toContain('"@type": "Person"')
    expect(html).toContain('"@type": "CreativeWork"')
  })
})
