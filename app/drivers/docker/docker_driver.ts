import { Docker } from 'node-docker-api'
import env from '#start/env'
import IDriver from '#drivers/idriver'
import DockerDatabasesService from './docker_databases_service.js'
import DockerApplicationsService from './docker_applications_service.js'
import DockerDeploymentsService from './docker_deployments_service.js'
import DockerEventsWatcher from './docker_events_watcher.js'

export default class DockerDriver implements IDriver {
  private readonly docker: Docker

  public applications: DockerApplicationsService
  public databases: DockerDatabasesService
  public deployments: DockerDeploymentsService

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
          ListenAddr: '0.0.0.0:2377',
        })
      } else {
        throw error
      }
    }
  }

  async initializeDriver() {
    await this.initializeSwarmIfNotInitialized()

    const dockerEventsWatcher = new DockerEventsWatcher(this.docker)
    dockerEventsWatcher.watchEvents()
  }
}
