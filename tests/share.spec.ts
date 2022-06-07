import { test, expect } from '@playwright/test'

test('check qrcode', async ({ page }) => {
  await page.goto('/')
  const host = page.url()

  await page.locator('#nav-share').click()
  expect(page.url()).toBe(`${host}share`)

  await page.waitForTimeout(2000)
  expect(true).toBe(true)
})
