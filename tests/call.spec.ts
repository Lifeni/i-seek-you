import { test, expect } from '@playwright/test'

test.describe('call test', () => {
  test('just call', async ({ page }) => {
    await page.waitForTimeout(4000)
    expect(true).toBe(true)
  })

  test('call with auth', async ({ page }) => {
    await page.waitForTimeout(3000)
    expect(true).toBe(true)
  })
})
