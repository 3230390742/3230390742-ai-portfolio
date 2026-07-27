import { expect, test } from '@playwright/test'

test('critical portfolio flow works without horizontal overflow', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('把 AI 原型做成可验证的产品。')
  if (testInfo.project.name.startsWith('mobile')) {
    await page.getByRole('button', { name: '打开导航' }).click()
  }
  await page.getByRole('navigation', { name: '主要导航' }).getByRole('link', { name: '重点项目' }).click()
  await expect(page.locator('#featured-work')).toBeInViewport()
  await page.getByRole('button', { name: /查看：AI research profile/ }).click()
  await expect(page.getByRole('dialog', { name: '个人 RAG 知识库媒体' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('the first case-study cue is visible in the initial viewport', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#featured-work article').first().getByText('01 / FEATURED')).toBeInViewport()
})

test('mobile navigation aligns with the compact header', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile layout only')

  await page.goto('/')
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 100)
  })
  const header = page.locator('header')
  await expect(header).toHaveClass(/compact/)
  await expect(header).toHaveCSS('height', '60px')
  await expect.poll(async () => (await header.boundingBox())?.height ?? 0).toBeCloseTo(60, 0)
  const menuButton = page.getByRole('button', { name: '打开导航' })
  const menuButtonBox = await menuButton.boundingBox()
  expect(menuButtonBox).not.toBeNull()
  await page.mouse.click(menuButtonBox!.x + menuButtonBox!.width / 2, menuButtonBox!.y + menuButtonBox!.height / 2)
  await expect(header).toHaveClass(/compact/)
  const navigation = page.getByRole('navigation', { name: '主要导航' })
  await expect(navigation).toHaveCSS('top', '60px')

  const [headerBox, navigationBox] = await Promise.all([
    header.boundingBox(),
    navigation.boundingBox(),
  ])
  expect(headerBox).not.toBeNull()
  expect(navigationBox).not.toBeNull()
  expect(navigationBox!.y).toBeCloseTo(headerBox!.y + headerBox!.height, 0)
})

test('audited project thumbnails load before visual review', async ({ page }) => {
  await page.goto('/')
  const thumbnails = page.getByRole('button', { name: /查看：(桌面|手机)视口/ }).locator('img')
  await expect.poll(async () => thumbnails.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true)
})

test('project thumbnails preserve their complete source composition', async ({ page }) => {
  await page.goto('/')
  const thumbnails = page.getByRole('button', { name: /查看：(AI research profile|Personal memory profile)/ }).locator('img')
  await expect.poll(async () => thumbnails.evaluateAll((images) => images.every((image) => {
    const renderedRatio = image.clientWidth / image.clientHeight
    const sourceRatio = image.naturalWidth / image.naturalHeight
    return Math.abs(renderedRatio - sourceRatio) < 0.01
  }))).toBe(true)
})

test('public contact and resume resources are valid', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: '发送邮件' })).toHaveAttribute('href', 'mailto:3230390742@qq.com')
  await expect(page.getByRole('link', { name: '访问 GitHub' })).toHaveAttribute('rel', /noreferrer/)
  const resume = await request.get('/resume/磨海清_AI应用工程实习简历.pdf')
  expect(resume.ok()).toBeTruthy()
  expect(resume.headers()['content-type']).toContain('application/pdf')
  expect((await resume.body()).byteLength).toBeGreaterThan(10_000)
})
