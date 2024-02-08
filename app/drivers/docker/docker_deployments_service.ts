import { Docker } from 'node-docker-api'
import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import DockerDeploymentsConfigurationBuilder from './docker_deployments_configuration_builder.js'

export default class DockerDeploymentsService implements IDriverDeploymentsService {
  private readonly dockerDeploymentsConfigurationBuilder =
    new DockerDeploymentsConfigurationBuilder()

  constructor(private readonly docker: Docker) {}

  async igniteBuilder(application: Application, _deployment: Deployment) {
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

  async igniteApplication(application: Application, _deployment: Deployment) {
    console.log('Igniting application...')
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
    console.log('Pulling image...')
    const promisifyStream = (stream: any) =>
      new Promise((resolve, reject) => {
        stream.on('data', (data: any) => console.log(data.toString()))
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    await this.docker.image
      .create({}, { fromImage: configuration.Image })
      .then((stream) => promisifyStream(stream))
    console.log('Image pulled')

    /**
     * We check if the container already exists and delete it if it does.
     */
    console.log('Checking if container already exists...')
    const containerAlreadyExists = await this.docker.container.list({
      all: true,
      filters: {
        name: [configuration.name],
      },
    })
    if (containerAlreadyExists.length > 0) {
      console.log('Container already exists, deleting it...')
      const container = this.docker.container.get(containerAlreadyExists[0].id)
      await container.delete({ force: true })
    }

    /**
     * Then we create and start the container.
     */
    console.log('Creating and starting container...')
    const container = await this.docker.container.create(configuration)
    await container.start()
    console.log('Container created and started')
  }

  shouldMonitorHealthcheck(_application: Application, _deployment: Deployment) {
    /**
     * Docker driver does not support healthchecks (yet).
     */
    return false
  }
}
