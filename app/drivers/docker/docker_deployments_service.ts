import { Docker } from 'node-docker-api'
import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
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

  async igniteApplication(application: Application, deployment: Deployment) {
    deployment.status = DeploymentStatus.Deploying
    await deployment.save()

    const configuration =
      this.dockerDeploymentsConfigurationBuilder.prepareContainerConfiguration(application)

    await this.docker.image.create({}, { fromImage: configuration.Image })

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
    const container = await this.docker.container.create(configuration)

    await container.start()

    deployment.status = DeploymentStatus.Success
    await deployment.save()
  }
}