import { test, expect } from '@playwright/test'

test('join channel', async ({ page }) => {
  await page.goto('/')
  const host = page.url()

  const join = page.locator('#nav-join')
  await join.click()
  expect(page.url()).toBe(`${host}+`)

  const input = page.locator('#join-input')
  await input.type('0000')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2000)
  expect(page.url()).toBe(`${host}channels/0000`)
})
