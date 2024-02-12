import { Docker } from 'node-docker-api'
import env from '#start/env'
import IDriver from '#drivers/idriver'
import DockerDatabasesService from './docker_databases_service.js'
import DockerApplicationsService from './docker_applications_service.js'
import DockerDeploymentsService from './docker_deployments_service.js'
import DockerEventsWatcher from './docker_events_watcher.js'
import { publicIpv4 } from 'public-ip'

export default class DockerDriver implements IDriver {
  private readonly docker: Docker

  public applications: DockerApplicationsService
  public databases: DockerDatabasesService
  public deployments: DockerDeploymentsService

  public ipv4: string = '0.0.0.0'

  constructor() {
    this.docker = new Docker({
      socketPath: env.get('DOCKER_SOCKET_PATH', '/var/run/docker.sock'),
    })
    this.applications = new DockerApplicationsService(this.docker)
    this.databases = new DockerDatabasesService(this.docker)
    this.deployments = new DockerDeploymentsService(this.docker)
  }

  private async initializeSwarmIfNotInitialized() {
    /**
     * We initialize Docker Swarm if it is not initialized already,
     * in order to make Traefik work properly.
     */
    try {
      await this.docker.swarm.status()
    } catch (error) {
      if (error.statusCode === 503) {
        await this.docker.swarm.init({
          ListenAddr: ':2377',
        })
      } else {
        throw error
      }
    }
  }

  private async prepareBuilderImage() {
    const image = env.get('BUILDER_IMAGE', 'softwarecitadel/builder')

    const images = await this.docker.image.list({
      all: true,
      filters: {
        reference: [image],
      },
    })
    if (images.length === 0) {
      await this.docker.image.create({}, { fromImage: image })
    }
  }

  async initializeDriver() {
    await this.initializeSwarmIfNotInitialized()

    await this.prepareBuilderImage()

    this.ipv4 = env.get('IPV4', await publicIpv4())

    const dockerEventsWatcher = new DockerEventsWatcher(this.docker)
    dockerEventsWatcher.watchEvents()
  }
}
