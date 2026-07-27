import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(blocking).toEqual([])
})

test('skip link and dialog are keyboard operable', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: '跳到主要内容' })).toBeFocused()
  await page.getByRole('button', { name: /查看：AI research profile/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '关闭媒体' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: /查看：AI research profile/ })).toBeFocused()
})
