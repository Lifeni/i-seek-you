import { test, expect } from '@playwright/test'

test('not found page', async ({ page }) => {
  await page.goto('/404')
  const header = page.locator('#page-title')
  await expect(header).toContainText('Not Found')
})
