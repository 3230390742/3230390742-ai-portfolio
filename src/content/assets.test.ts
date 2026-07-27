// @vitest-environment node
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { portfolioData } from './portfolio'

describe('public portfolio assets', () => {
  it('contains every local image, video, poster, and resume', () => {
    const paths = new Set([portfolioData.person.resumeUrl])
    for (const project of portfolioData.featuredProjects) {
      for (const visual of project.visuals) {
        if (visual.kind === 'image') paths.add(visual.src)
        if (visual.kind === 'video') {
          paths.add(visual.src)
          paths.add(visual.poster)
        }
      }
    }
    for (const assetPath of paths) {
      const file = resolve(process.cwd(), 'public', assetPath.replace(/^\//, ''))
      expect(existsSync(file), file).toBe(true)
      expect(statSync(file).size, file).toBeGreaterThan(1_024)
    }
  })
})
