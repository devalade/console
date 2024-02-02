import env from '#start/env'
import IDriver from './idriver.js'

export default class Driver {
  static async getDriver(): Promise<IDriver> {
    let driver: IDriver
    switch (env.get('DRIVER')) {
      case 'docker':
        const DockerDriver = (await import('./docker/docker_driver.js')).default
        driver = new DockerDriver()
        break
      case 'fly':
        const FlyDriver = (await import('../drivers/fly/fly_driver.js')).default
        driver = new FlyDriver()
        break
    }
    return driver
  }
}
