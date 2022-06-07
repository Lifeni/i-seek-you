import { test, expect } from '@playwright/test'

test('check device list', async ({ page }) => {
  await page.goto('/')
  const title = page.locator('title')
  await expect(title).toHaveText('I Seek You')

  await page.waitForTimeout(2000)
  const id = page.locator('#device-id')
  await expect(id).toContainText('#')
})
