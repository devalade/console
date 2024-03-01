import type { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import Organization from '#models/organization'
import Project from '#models/project'
import FlyApi from './api/fly_api.js'
import { AddressType } from './api/fly_networks_api.js'
import FlyDatabasesConfigurationBuilder from './fly_databases_configuration_builder.js'

export default class FlyDatabasesService implements IDriverDatabasesService {
  private readonly flyApi = new FlyApi()
  private readonly flyDatabasesConfigurationBuilder = new FlyDatabasesConfigurationBuilder()

  public async createDatabase(
    _organization: Organization,
    _project: Project,
    database: Database
  ): Promise<void> {
    const applicationName = this.flyApi.getFlyDatabaseName(database.slug)

    await this.flyApi.apps.createApplication({
      app_name: applicationName,
      org_slug: 'personal',
    })

    /**
     * 😢 WARNING: Dedicated IPv4 addresses are not free anymore.
     *
     * Then, we allocate a dedicated IPV4 for the database.
     * We need these addresses to expose the database to the internet.
     */
    await this.flyApi.networks.allocateIpAddress({
      appId: applicationName,
      type: AddressType.v4,
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

  async deleteDatabase(_organization: Organization, _project: Project, database: Database) {
    await this.flyApi.apps.deleteApplication(this.flyApi.getFlyDatabaseName(database.slug))
  }
}
