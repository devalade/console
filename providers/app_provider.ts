import { ApplicationService } from '@adonisjs/core/types'
import Driver from '#drivers/driver'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    await import('../src/extensions.js')

    const driver = await Driver.getInstance()
    await driver.initializeDriver()
  }
}
