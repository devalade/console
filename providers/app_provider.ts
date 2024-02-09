import { ApplicationService } from '@adonisjs/core/types'
import Driver from '#drivers/driver'
import env from '#start/env'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    await import('../src/macros.js')
    await import('../src/features.js')

    if (env.get('NODE_ENV') !== 'test') {
      const driver = Driver.getDriver()
      await driver.initializeDriver()
    }
  }
}
