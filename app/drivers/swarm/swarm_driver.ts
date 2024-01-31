import { Docker } from 'node-docker-api'
import env from '#start/env'
import IDriver, { IDriverApplicationsService, IDriverDeploymentsService } from '#drivers/idriver'
import SwarmDatabasesService from './swarm_databases_service.js'
import SwarmApplicationsService from './swarm_applications_service.js'
import SwarmDeploymentsService from './swarm_deployments_service.js'

export default class SwarmDriver implements IDriver {
  private readonly docker: Docker

  public applications: SwarmApplicationsService
  public databases: SwarmDatabasesService
  public deployments: SwarmDeploymentsService

  constructor() {
    this.docker = new Docker({
      socketPath: env.get('DOCKER_SOCKET_PATH', '/var/run/docker.sock'),
    })
    this.applications = new SwarmApplicationsService(this.docker)
    this.databases = new SwarmDatabasesService(this.docker)
    this.deployments = new SwarmDeploymentsService(this.docker)
  }

  private async initializeSwarmIfNotInitialized() {
    try {
      await this.docker.swarm.status()
    } catch (error) {
      if (error.statusCode === 503) {
        await this.docker.swarm.init({
          ListenAddr: '0.0.0.0:2377',
        })
      } else {
        throw error
      }
    }
  }

  async initializeDriver() {
    await this.initializeSwarmIfNotInitialized()
  }

  async igniteApplication(config: {
    name: string
    image: string
    environmentVariables: Record<string, string>
    ports: Record<string, number>
  }) {
    await this.docker.container.create({
      name: config.name,
      Image: config.image,
      Labels: {
        'traefik.enable': 'true',
        [`traefik.http.routers.${config.name}.rule`]: `Host(\`${config.name}.beaulieu.land\`)`,
        [`traefik.http.routers.${config.name}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${config.name}.tls.certresolver`]: 'myresolver',
      },
      Env: Object.entries(config.environmentVariables).map(([key, value]) => `${key}=${value}`),
      NetworkingConfig: {
        EndpointsConfig: {
          traefik: {
            NetworkID: 'traefik',
          },
        },
      },
    })

    await this.docker.container.get(config.name).start()
  }
}
