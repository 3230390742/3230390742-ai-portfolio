// @vitest-environment node
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('static metadata', () => {
  const html = readFileSync('index.html', 'utf8')
  it('contains the approved title, description, canonical, and social image', () => {
    expect(html).toContain('<title>磨海清｜RAG / Agent 应用工程作品集</title>')
    expect(html).toContain('https://3230390742-ai-portfolio.vercel.app/')
    expect(html).toContain('/og-portfolio.png')
  })
  it('contains Person and CreativeWork structured data', () => {
    expect(html).toContain('"@type": "Person"')
    expect(html).toContain('"@type": "CreativeWork"')
  })
})
