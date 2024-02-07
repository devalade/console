import env from '#start/env'
import IDriver from './idriver.js'
import DockerDriver from './docker/docker_driver.js'
import FlyDriver from '../drivers/fly/fly_driver.js'

export default class Driver {
  static driver: IDriver

  static getDriver(): IDriver {
    if (this.driver) {
      return this.driver
    }

    switch (env.get('DRIVER')) {
      case 'docker':
        this.driver = new DockerDriver()
        break
      case 'fly':
        this.driver = new FlyDriver()
        break
    }
    return this.driver
  }
}
