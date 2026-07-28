import { expect, test } from '@playwright/test'
import { readFile, stat } from 'node:fs/promises'

test('social capture includes portfolio identity and a project cue', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('main section').first()
  await expect(hero).toContainText('磨海清')
  await expect(hero.getByRole('link', { name: '查看重点项目' })).toBeVisible()
})

test('captures a non-empty 1200×630 social image', async ({ page }) => {
  test.skip(Boolean(process.env.PLAYWRIGHT_TEST_BASE_URL), 'Local artifact generation only')

  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto('/')
  await page.locator('header').evaluate((node) => { node.style.display = 'none' })
  const hero = page.locator('main section').first()
  await hero.evaluate((node) => {
    const element = node as HTMLElement
    element.style.width = '1200px'
    element.style.maxWidth = 'none'
    element.style.minHeight = '0'
    element.style.height = '440px'
    element.style.padding = '40px 0 16px'
    element.style.alignContent = 'start'
    element.style.overflow = 'hidden'
    element.querySelector('dl')?.setAttribute('style', 'display: none')
  })
  await expect(hero.locator('p').first()).toBeInViewport({ ratio: 0.8 })
  await expect(page.locator('#featured-work h3').first()).toBeInViewport({ ratio: 0.8 })
  await page.screenshot({ path: 'public/og-portfolio.png', clip: { x: 0, y: 0, width: 1200, height: 630 }, animations: 'disabled' })
  expect((await stat('public/og-portfolio.png')).size).toBeGreaterThan(20_000)
  const image = await readFile('public/og-portfolio.png')
  expect(image.readUInt32BE(16)).toBe(1200)
  expect(image.readUInt32BE(20)).toBe(630)
})
