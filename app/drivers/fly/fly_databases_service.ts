import type { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import FlyApi from './api/fly_api.js'
import FlyDatabasesConfigurationBuilder from './fly_databases_configuration_builder.js'

export default class FlyDatabasesService implements IDriverDatabasesService {
  private readonly flyApi = new FlyApi()
  private readonly flyDatabasesConfigurationBuilder = new FlyDatabasesConfigurationBuilder()

  public async createDatabase(database: Database): Promise<void> {
    const applicationName = this.flyApi.getFlyDatabaseName(database.slug)

    await this.flyApi.apps.createApplication({
      app_name: applicationName,
      org_slug: 'personal',
    })

    const { id: volume } = await this.flyApi.volumes.createVolume(applicationName, {
      name: `${database.slug.replace('-', '_')}_data`,
      size_gb: 1,
      region: 'lhr',
      machines_only: true,
    })

    await this.flyApi.machines.createMachine(applicationName, {
      region: 'lhr',
      config: this.flyDatabasesConfigurationBuilder.prepareDatabaseConfiguration(database, volume),
    })
  }

  async deleteDatabase(_database: Database) {}
}
