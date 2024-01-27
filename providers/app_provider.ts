import env from '#start/env'
import IDriver from '../app/drivers/idriver.js'

export default class AppProvider {
  async boot() {
    let driver: IDriver
    switch (env.get('DRIVER')) {
      case 'swarm':
        const SwarmDriver = (await import('../app/drivers/swarm/swarm_driver.js')).default
        driver = new SwarmDriver()
        break
    }
    await driver.initializeDriver()
  }
}
