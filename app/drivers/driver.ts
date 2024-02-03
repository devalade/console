import env from '#start/env'
import IDriver from './idriver.js'
import DockerDriver from './docker/docker_driver.js'
import FlyDriver from '../drivers/fly/fly_driver.js'

export default class Driver {
  static getDriver(): IDriver {
    let driver: IDriver
    switch (env.get('DRIVER')) {
      case 'docker':
        driver = new DockerDriver()
        break
      case 'fly':
        driver = new FlyDriver()
        break
    }
    return driver
  }
}
