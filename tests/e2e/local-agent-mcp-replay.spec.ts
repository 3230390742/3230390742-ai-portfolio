import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('Local Agent replay is static, keyboard reachable, and accessible', async ({ page }) => {
  const external: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (!['localhost', '127.0.0.1'].includes(url.hostname)) external.push(request.url())
  })

  await page.goto('/#local-agent-mcp')
  const caseStudy = page.getByRole('article', { name: /Local Agent MCP/ })
  await expect(caseStudy.getByRole('tab', { name: '运行控制台' })).toHaveAttribute('aria-selected', 'true')
  await caseStudy.getByRole('tab', { name: '运行控制台' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(caseStudy.getByRole('tab', { name: 'Agent 对比' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(caseStudy.getByText('PUBLICATION_OK')).toBeVisible()
  expect(external).toEqual([])

  const results = await new AxeBuilder({ page }).include('#local-agent-mcp').analyze()
  expect(results.violations.filter((item) => item.impact === 'critical' || item.impact === 'serious')).toEqual([])
})

test('Local Agent replay clears the fixed header and never overflows its case study', async ({ page }) => {
  await page.goto('/#local-agent-mcp')
  const caseStudy = page.locator('#local-agent-mcp')
  const [siteHeader, caseBox] = await Promise.all([
    page.getByRole('banner').first().boundingBox(),
    caseStudy.boundingBox(),
  ])
  expect(siteHeader).not.toBeNull()
  expect(caseBox).not.toBeNull()
  expect(caseBox!.y).toBeGreaterThanOrEqual(siteHeader!.y + siteHeader!.height)

  const overflow = await caseStudy.evaluate((node) => node.scrollWidth > node.clientWidth)
  expect(overflow).toBe(false)
})

test('Local Agent replay matches reviewed visual states', async ({ page }) => {
  await page.goto('/#local-agent-mcp')
  await page.evaluate(async () => { await document.fonts.ready })
  await page.addStyleTag({ content: '#root > header, .skipLink { visibility: hidden !important; }' })
  const caseStudy = page.locator('#local-agent-mcp')

  for (const state of [
    { tab: '运行控制台', snapshot: 'local-agent-run.png' },
    { tab: 'Agent 对比', snapshot: 'local-agent-compare.png' },
    { tab: '安全审计', snapshot: 'local-agent-audit.png' },
  ]) {
    await caseStudy.getByRole('tab', { name: state.tab }).click()
    await expect(caseStudy.getByRole('tab', { name: state.tab })).toHaveAttribute('aria-selected', 'true')
    await expect(caseStudy).toHaveScreenshot(state.snapshot, { animations: 'disabled', caret: 'hide' })
  }
})
