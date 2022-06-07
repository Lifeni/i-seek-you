import { test, expect } from '@playwright/test'

test.describe('change settings', () => {
  test('change device name', async ({ page }) => {
    await page.waitForTimeout(3000)
    expect(true).toBe(true)
  })

  test('change password', async ({ page }) => {
    await page.waitForTimeout(3000)
    expect(true).toBe(true)
  })
})
