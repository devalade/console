import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import SwarmDriver from '../app/drivers/swarm/swarm_driver.js'
import { randomUUID } from 'crypto'

export default class Prout extends BaseCommand {
  static commandName = 'test-swarm-driver'
  static description = ''
  static settings = {
    loadApp: true,
  }

  static options: CommandOptions = {}

  async run() {
    const swarmDriver = new SwarmDriver()
    await swarmDriver.igniteApplication({
      name: 'prout' + randomUUID(),
      image: 'traefik/whoami',
      environmentVariables: {},
      ports: {},
    })
  }
}
