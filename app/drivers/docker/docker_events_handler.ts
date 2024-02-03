import Driver from '#drivers/driver'
import Application from '#models/application'
import { DeploymentStatus } from '#models/deployment'

export default class DockerEventsHandler {
  async handleSuccessfulBuild(applicationSlug: string) {
    const application = await Application.findByOrFail('slug', applicationSlug)
    const latestDeploymentWithBuildingStatus = await application
      .related('deployments')
      .query()
      .where('status', 'building')
      .orderBy('created_at', 'desc')
      .firstOrFail()
    const driver = Driver.getDriver()
    await driver.deployments.igniteApplication(application, latestDeploymentWithBuildingStatus)
  }

  async handleFailedBuild(applicationSlug: string) {
    const application = await Application.findByOrFail('slug', applicationSlug)
    const latestDeploymentWithBuildingStatus = await application
      .related('deployments')
      .query()
      .where('status', 'building')
      .orderBy('created_at', 'desc')
      .firstOrFail()
    latestDeploymentWithBuildingStatus.status = DeploymentStatus.BuildFailed
    await latestDeploymentWithBuildingStatus.save()
  }
}
