import { Docker } from 'node-docker-api'
import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import DockerDeploymentsConfigurationBuilder from './docker_deployments_configuration_builder.js'
import Organization from '#models/organization'
import Project from '#models/project'

export default class DockerDeploymentsService implements IDriverDeploymentsService {
  private readonly dockerDeploymentsConfigurationBuilder =
    new DockerDeploymentsConfigurationBuilder()

  constructor(private readonly docker: Docker) {}

  async igniteBuilder(
    _organization: Organization,
    _project: Project,
    application: Application,
    _deployment: Deployment
  ) {
    const builderConfiguration =
      this.dockerDeploymentsConfigurationBuilder.prepareBuilderContainerConfiguration(application)

    const containerAlreadyExists = await this.docker.container.list({
      all: true,
      filters: {
        name: [builderConfiguration.name],
      },
    })
    if (containerAlreadyExists.length > 0) {
      const container = this.docker.container.get(containerAlreadyExists[0].id)
      await container.delete({ force: true })
    }

    const container = await this.docker.container.create(builderConfiguration)
    await container.start()
  }

  async igniteApplication(
    _organization: Organization,
    _project: Project,
    application: Application,
    _deployment: Deployment
  ) {
    await this.igniteContainerForApplication(application)
  }

  async igniteContainerForApplication(application: Application) {
    /**
     * Loading certificates before building the container
     * to make sure they are available for the configuration builder.
     * It allows to prepare labels with the correct host (for Traefik).
     */
    await application.load('certificates')

    const configuration =
      this.dockerDeploymentsConfigurationBuilder.prepareContainerConfiguration(application)

    /**
     * We pull the image from the registry before creating the container.
     */
    const promisifyStream = (stream: any) =>
      new Promise((resolve, reject) => {
        stream.on('data', (data: any) => console.log(data.toString()))
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    await this.docker.image
      .create({}, { fromImage: configuration.Image })
      .then((stream) => promisifyStream(stream))

    /**
     * We check if the container already exists and delete it if it does.
     */
    const containerAlreadyExists = await this.docker.container.list({
      all: true,
      filters: {
        name: [configuration.name],
      },
    })
    if (containerAlreadyExists.length > 0) {
      const container = this.docker.container.get(containerAlreadyExists[0].id)
      await container.delete({ force: true })
    }

    /**
     * Then we create and start the container.
     */
    const container = await this.docker.container.create(configuration)
    await container.start()
  }

  shouldMonitorHealthcheck(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _deployment: Deployment
  ) {
    /**
     * Docker driver does not support healthchecks (yet).
     */
    return false
  }
}
