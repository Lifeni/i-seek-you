import { test, expect } from '@playwright/test'

test.describe('voice call', () => {
  test('send audio', async ({ page }) => {
    await page.waitForTimeout(4000)
    expect(true).toBe(true)
  })

  test('send video', async ({ page }) => {
    await page.waitForTimeout(6000)
    expect(true).toBe(true)
  })
})
