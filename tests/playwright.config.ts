import { PlaywrightTestConfig } from '@playwright/test'
const config: PlaywrightTestConfig = {
  use: { channel: 'chrome', baseURL: 'https://i-seek-you.dist.run' },
}
export default config
