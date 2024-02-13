import Application from '#models/application'
import emitter from '@adonisjs/core/services/emitter'

export default class DockerEventsHandler {
  async handleSuccessfulBuildEvent(applicationSlug: string) {
    const application = await Application.findByOrFail('slug', applicationSlug)
    await application.load('project', (query) => {
      query.preload('organization')
    })
    const latestDeploymentWithBuildingStatus = await application
      .related('deployments')
      .query()
      .where('status', 'building')
      .orderBy('created_at', 'desc')
      .firstOrFail()

    emitter.emit('builds:success', [
      application.project.organization,
      application.project,
      application,
      latestDeploymentWithBuildingStatus,
    ])
  }

  async handleFailedBuildEvent(applicationSlug: string) {
    const application = await Application.findByOrFail('slug', applicationSlug)
    const latestDeploymentWithBuildingStatus = await application
      .related('deployments')
      .query()
      .where('status', 'building')
      .orderBy('created_at', 'desc')
      .firstOrFail()

    emitter.emit('builds:failure', [application, latestDeploymentWithBuildingStatus])
  }

  async handleContainerStartEvent(applicationSlug: string) {
    /**
     * We try to find the latest deployment with the "deploying" status.
     */
    const application = await Application.findByOrFail('slug', applicationSlug)
    const latestDeploymentWithStartingStatus = await application
      .related('deployments')
      .query()
      .where('status', 'deploying')
      .firstOrFail()

    /**
     * Since there is no healthcheck for the Docker driver (yet),
     * we consider the deployment as successful as soon as the container starts.
     */
    emitter.emit('deployments:success', [application, latestDeploymentWithStartingStatus])
  }
}
