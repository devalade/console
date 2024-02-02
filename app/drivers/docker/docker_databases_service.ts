import { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import { Docker } from 'node-docker-api'
import DockerDatabasesConfigurationBuilder from './docker_databases_configuration_builder.js'

export default class DockerDatabasesService implements IDriverDatabasesService {
  private readonly dockerDatabasesConfigurationBuilder = new DockerDatabasesConfigurationBuilder()
  constructor(private readonly docker: Docker) {}

  async createDatabase(database: Database) {
    const serviceConfiguration = this.dockerDatabasesConfigurationBuilder.build(database)
    await this.docker.service.create(serviceConfiguration)
  }

  async deleteDatabase(database: Database) {
    const service = this.docker.service.get(`citadel-${database.slug}`)
    await service.remove()
  }
}
