// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { agentReplay } from './agentReplay'

const FORBIDDEN = [
  /[A-Za-z]:\\/,
  /\\\\[^\\\r\n]+\\/,
  /\/(?:Users|home|mnt|tmp|var\/tmp)\//,
  /\bses_[A-Za-z0-9_-]+\b/i,
  /\b(?:session|thread)(?:[_-]?id)?\s*[:=]/i,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /\b(?:sk-|gh[pousr]_)[A-Za-z0-9_-]{16,}\b/i,
  /Authorization:\s*Bearer/i,
  /(?:^|[^\p{L}\p{N}_])["']?(?:key|api[_-]?key|secret|password|passwd|token|provider|credentials?)["']?\s*[:=]\s*[^\s,}]+/iu,
  /%(?:25){0,2}(?:2f|5c|3a)/i,
  /\b(?:raw[-_\s]?stderr|stderr\s*:|unreviewed\s+prompt)\b/i,
]

const REQUIRED_CHECKS = [
  'schema',
  'read_only',
  'no_absolute_paths',
  'no_credentials',
  'no_session_ids',
  'verification',
  'source_revision',
]

function scanStrings(value: unknown, patterns: RegExp[]): RegExp | undefined {
  if (typeof value === 'string') {
    return patterns.find((p) => p.test(value))
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = scanStrings(item, patterns)
      if (found) return found
    }
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = scanStrings(item, patterns)
      if (found) return found
    }
  }
  return undefined
}

describe('agentReplay integrity', () => {
  const manifestBytes = readFileSync('src/content/artifacts/local-agent-mcp/demo-manifest.json')
  const receipt = JSON.parse(readFileSync('src/content/artifacts/local-agent-mcp/publication-receipt.json', 'utf8'))

  it('matches the SHA-256 receipt hash', () => {
    const actual = createHash('sha256').update(manifestBytes).digest('hex')
    expect(actual).toBe(receipt.manifestSha256)
  })

  it('has the approved receipt and source revision contract', () => {
    expect(receipt.status).toBe('PUBLICATION_OK')
    expect(receipt.checks).toEqual(REQUIRED_CHECKS)
    expect(agentReplay.sourceRevision).toMatch(/^[0-9a-f]{40}$/)
  })

  it('both agents passed', () => {
    expect(agentReplay.comparison.codex.status).toBe('passed')
    expect(agentReplay.comparison.opencode.status).toBe('passed')
  })

  it('reports fully passing tests', () => {
    expect(agentReplay.verification.testFilesPassed).toBeGreaterThan(0)
    expect(agentReplay.verification.testFilesPassed).toBe(agentReplay.verification.testFilesTotal)
    expect(agentReplay.verification.testsPassed).toBeGreaterThan(0)
    expect(agentReplay.verification.testsPassed).toBe(agentReplay.verification.testsTotal)
  })

  it('contains no forbidden privacy patterns', () => {
    const matched = scanStrings(agentReplay, FORBIDDEN)
    expect(matched).toBeUndefined()
  })
})
