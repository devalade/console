import FlyApiCaller from './fly_api_caller.js'
import FlyAppsApi from './fly_apps_api.js'
import FlyMachinesApi from './fly_machines_api.js'
import FlyNetworksApi from './fly_networks_api.js'
import FlyCertificatesApi from './fly_certificates_api.js'
import FlyVolumesApi from './fly_volumes_api.js'
import env from '#start/env'

export const FLY_APPLICATION_NAME_PREFIX = env.get('FLY_APPLICATION_NAME_PREFIX', 'citadel-app')
export const FLY_BUILDER_NAME_PREFIX = env.get('FLY_BUILDER_NAME_PREFIX', 'citadel-builder')
export const FLY_DATABASE_NAME_PREFIX = env.get('FLY_DATABASE_NAME_PREFIX', 'citadel-database')

type LogItem = {
  id: string
  type: 'logs'
  attributes: {
    timestamp: string
    message: string
    level: 'info' | 'error'
    instance: string
    region: string
    meta: {
      region: string
      instance: string
      event: any
      http: any
      error: any
      url: any
    }
  }
}

export default class FlyApi {
  private readonly apiCaller: FlyApiCaller

  readonly apps: FlyAppsApi
  readonly machines: FlyMachinesApi
  readonly networks: FlyNetworksApi
  readonly certificates: FlyCertificatesApi
  readonly volumes: FlyVolumesApi

  constructor(token: string = env.get('FLY_TOKEN')!) {
    this.apiCaller = new FlyApiCaller(token)

    this.apps = new FlyAppsApi(this.apiCaller)
    this.machines = new FlyMachinesApi(this.apiCaller)
    this.networks = new FlyNetworksApi(this.apiCaller)
    this.certificates = new FlyCertificatesApi(this.apiCaller, this)
    this.volumes = new FlyVolumesApi(this.apiCaller)
  }

  /**
   * Returns the name of the machine that will be used to build the application.
   * @param applicationSlug The slug of the application to deploy.
   * @param isBuilder Whether the machine is a builder or not.
   */
  getFlyApplicationName(applicationSlug: string, isBuilder: boolean = false): string {
    if (isBuilder) {
      return `${FLY_BUILDER_NAME_PREFIX}-${applicationSlug}`
    }
    return `${FLY_APPLICATION_NAME_PREFIX}-${applicationSlug}`
  }

  /**
   * Returns the name of the machine that will be used to build the database.
   * @param databaseSlug The slug of the database to deploy.
   */
  getFlyDatabaseName(databaseSlug: string): string {
    return `${FLY_DATABASE_NAME_PREFIX}-${databaseSlug}`
  }

  async getLogs(applicationId: string, nextToken?: string) {
    const baseUrl = 'https://api.fly.io/api/v1'

    let path = `/apps/${applicationId}/logs`
    if (nextToken) {
      path += `?next_token=${nextToken}`
    }

    const logResponse: { data: LogItem[]; meta: { next_token: string } } =
      await this.apiCaller.callRestApi('GET', path, null, false, baseUrl)

    return logResponse
  }
}
