import { expect, test } from '@playwright/test'

test.skip(process.platform !== 'win32', 'Reviewed visual baselines target Windows Chromium')
test.use({ reducedMotion: 'reduce' })

test('matches the reviewed complete-page baseline', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => { await document.fonts.ready })
  await expect(page).toHaveScreenshot('portfolio-full-page.png', { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 })
})

test('hero is nonblank and stable', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('main section').first()
  await expect(hero).toBeVisible()
  await expect(hero).toHaveScreenshot('portfolio-hero.png', { animations: 'disabled', maxDiffPixelRatio: 0.005 })
})
