import { test, expect } from '@playwright/test'

test('example test', async ({ page }) => {
  await page.goto('https://i-seek-you.dist.run/')
  const title = page.locator('title')
  await expect(title).toHaveText('I Seek You')
})
