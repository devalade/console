import { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import { Docker } from 'node-docker-api'
import SwarmDatabasesConfigurationBuilder from './swarm_databases_configuration_builder.js'

export default class SwarmDatabasesService implements IDriverDatabasesService {
  private readonly swarmDatabasesConfigurationBuilder = new SwarmDatabasesConfigurationBuilder()
  constructor(private readonly docker: Docker) {}

  async createDatabase(database: Database) {
    const serviceConfiguration = this.swarmDatabasesConfigurationBuilder.build(database)
    await this.docker.service.create(serviceConfiguration)
  }

  async deleteDatabase(database: Database) {
    const service = this.docker.service.get(`citadel-${database.slug}`)
    await service.remove()
  }
}
