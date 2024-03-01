import Driver from '#drivers/driver'
import { type EventsList } from '@adonisjs/core/types'

export default class DevMachinesListener {
  private driver = Driver.getDriver()

  async onCreation([organization, project, devMachine]: EventsList['dev-machine:created']) {
    await this.driver.devMachines?.createDevMachine(organization, project, devMachine)
  }

  async onDeletion([organization, project, devMachine]: EventsList['dev-machine:created']) {
    await this.driver.devMachines?.deleteDevMachine(organization, project, devMachine)
  }
}
