import { PlaywrightTestConfig } from '@playwright/test'
const config: PlaywrightTestConfig = {
  use: { channel: 'chrome', baseURL: 'http://localhost:8080', headless: false },
  workers: 1,
}
export default config
