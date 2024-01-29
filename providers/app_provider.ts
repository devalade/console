import { ApplicationService } from '@adonisjs/core/types'
import Driver from '#drivers/driver'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const driver = await Driver.getInstance()
    await driver.initializeDriver()
  }
}
