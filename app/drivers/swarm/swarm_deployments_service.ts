import { Docker } from 'node-docker-api'
import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import SwarmDeploymentsConfigurationBuilder from './swarm_deployments_configuration_builder.js'

export default class SwarmDeploymentsService implements IDriverDeploymentsService {
  private readonly swarmDeploymentsConfigurationBuilder = new SwarmDeploymentsConfigurationBuilder()

  constructor(private readonly docker: Docker) {}

  async igniteBuilder(application: Application, deployment: Deployment) {
    const serviceConfiguration = this.swarmDeploymentsConfigurationBuilder.build(
      application,
      deployment
    )
    await this.docker.service.create(serviceConfiguration)
  }

  igniteApplication(application: Application, deployment: Deployment) {
    throw new Error('Method not implemented.')
  }
}
