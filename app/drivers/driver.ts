import env from '#start/env'
import IDriver from './idriver.js'

export default class Driver {
  static async getInstance(): Promise<IDriver> {
    let driver: IDriver
    switch (env.get('DRIVER')) {
      case 'swarm':
        const SwarmDriver = (await import('../drivers/swarm/swarm_driver.js')).default
        driver = new SwarmDriver()
        break
    }
    return driver
  }
}
