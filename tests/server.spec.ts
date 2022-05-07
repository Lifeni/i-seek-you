import { test, expect } from '@playwright/test'

test('connected to server', async ({ page }) => {
  await page.goto('/')
  const host = page.url()

  await page.locator('#nav-server').click()
  expect(page.url()).toBe(`${host}server`)

  await page.waitForTimeout(2000)
  const status = page.locator('#device-status')
  await expect(status).toHaveText('Connected to Server')
})
