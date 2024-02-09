import { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import { Docker } from 'node-docker-api'
import DockerDatabasesConfigurationBuilder from './docker_databases_configuration_builder.js'

export default class DockerDatabasesService implements IDriverDatabasesService {
  private readonly dockerDatabasesConfigurationBuilder = new DockerDatabasesConfigurationBuilder()
  constructor(private readonly docker: Docker) {}

  async createDatabase(database: Database) {
    const serviceConfiguration = this.dockerDatabasesConfigurationBuilder.build(database)
    const container = await this.docker.container.create(serviceConfiguration)
    await container.start()
  }

  async deleteDatabase(database: Database) {
    const container = this.docker.container.get(`citadel-${database.slug}`)
    await container.delete({ force: true })
  }
}
