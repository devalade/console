import Driver from '#drivers/driver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
import Organization from '#models/organization'
import Project from '#models/project'
import OctokitService from '#services/octokit_service'
import { inject } from '@adonisjs/core'

@inject()
export default class BuildsListener {
  constructor(private octokitService: OctokitService) {}

  async onSuccess([organization, project, application, deployment]: [
    Organization,
    Project,
    Application,
    Deployment,
  ]) {
    /**
     * Mark deployment as deploying.
     */
    deployment.status = DeploymentStatus.Deploying
    await deployment.save()

    /**
     * Ignite the application.
     */
    const driver = Driver.getDriver()
    await driver.deployments.igniteApplication(organization, project, application, deployment)
  }

  async onFailure([application, deployment]: [Application, Deployment]) {
    /**
     * Mark deployment as failed.
     */
    deployment.status = DeploymentStatus.DeploymentFailed
    await deployment.save()

    /**
     * If the deployment's origin is GitHub, let's mark the GitHub check as failed.
     */
    if (deployment.origin === 'github') {
      await this.octokitService.markFailure(application, deployment)
    }
  }
}
