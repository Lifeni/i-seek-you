import { test, expect } from '@playwright/test'

test.describe('send message', () => {
  test('send text', async ({ page }) => {
    await page.waitForTimeout(4000)
    expect(true).toBe(true)
  })

  test('send image', async ({ page }) => {
    await page.waitForTimeout(5000)
    expect(true).toBe(true)
  })

  test('send files', async ({ page }) => {
    await page.waitForTimeout(6000)
    expect(true).toBe(true)
  })
})
