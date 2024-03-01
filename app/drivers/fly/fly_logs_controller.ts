import { FLY_APPLICATION_NAME_PREFIX, FLY_BUILDER_NAME_PREFIX } from '#drivers/fly/api/fly_api'
import { FlyLogEntry } from '#drivers/fly/types'
import Application from '#models/application'
import Deployment from '#models/deployment'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

/**
 * This controller is responsible for handling incoming logs from Fly.
 * It listens for logs from the Fly API and emits events based on the log entry.
 */
export default class FlyWebhooksController {
  async handleIncomingLogs({ request, response }: HttpContext) {
    /**
     * Ensure that the request is coming from Fly by checking the Authorization header.
     * If the header is not present or the secret is incorrect, return a 401 Unauthorized response.
     * This is to prevent unauthorized access to the webhook endpoint.
     */
    if (request.header('Authorization') !== `Bearer ${env.get('FLY_WEBHOOK_SECRET')}`) {
      return response.unauthorized()
    }

    for (const logEntry of request.body() as FlyLogEntry[]) {
      /**
       * We only care about logs from applications and builders that are managed by our console.
       * If the log entry is not from an application or builder that we manage, skip it.
       */
      if (
        !logEntry.fly.app.name.startsWith(FLY_APPLICATION_NAME_PREFIX) &&
        !logEntry.fly.app.name.startsWith(FLY_BUILDER_NAME_PREFIX)
      ) {
        continue
      }

      /**
       * Find the application that the log entry is for.
       * We need the application to emit events based on the log entry.
       */
      const applicationSlug: string = logEntry.fly.app.name
        .replace(FLY_APPLICATION_NAME_PREFIX + '-', '')
        .replace(FLY_BUILDER_NAME_PREFIX + '-', '')
      const application = await Application.findBy('slug', applicationSlug)
      if (!application) {
        continue
      }
      await application.load('project', (query) => query.preload('organization'))

      /**
       * Find the deployment that the log entry is for.
       * We need the deployment to emit events based on the log entry.
       */
      const deployment = await Deployment.query()
        .where('current_fly_machine_builder_id', logEntry.fly.app.instance)
        .orderBy('created_at', 'desc')
        .firstOrFail()

      /**
       * Emit a log event for the application that the log entry is for.
       * It allows us to stream the logs to the console in real-time.
       */
      emitter.emit(`fly:log:${logEntry.fly.app.name}`, {
        message: logEntry.message,
        timestamp: logEntry.timestamp,
      })

      /**
       * Handle log entries that indicate the end of a build.
       * We emit success or failure events for the build based on the log entry.
       */
      if (
        logEntry.fly.app.name.startsWith(FLY_BUILDER_NAME_PREFIX) &&
        logEntry.message.includes('Main child exited normally with code:')
      ) {
        const event = logEntry.message.includes('1') ? 'builds:failure' : 'builds:success'
        emitter.emit(event, [
          application.project.organization,
          application.project,
          application,
          deployment,
        ])
        return response.noContent()
      }

      /**
       * Handle log entries that indicate that the application has reached its max restart count.
       * We emit a failure event for the deployment based on the log entry.
       */
      if (logEntry.message.includes('machine has reached its max restart count')) {
        emitter.emit('deployments:failure', [application, deployment])
        return response.noContent()
      }

      /**
       * If we encounter some health check logs, we emit success or failure events for the deployment.
       */
      if (logEntry.message.includes('Health check')) {
        await this.handleHealthcheckLogEntry(application, deployment, logEntry)
        return response.noContent()
      }

      /**
       * We use this method to determine if the application has been deployed successfully.
       */
      if (
        logEntry.fly.app.name.startsWith(FLY_APPLICATION_NAME_PREFIX) &&
        !application.environmentVariables.PORT &&
        logEntry.message.includes('[fly api proxy] listening at /.fly/api')
      ) {
        emitter.emit('deployments:success', [application, deployment])
        return response.noContent()
      }
    }

    return response.noContent()
  }

  private async handleHealthcheckLogEntry(
    application: Application,
    deployment: Deployment,
    flyLogEntry: FlyLogEntry
  ) {
    // Case 1. Health check on port X has failed.
    if (flyLogEntry.message.includes('has failed')) {
      emitter.emit('deployments:failure', [application, deployment])
    }

    // Case 2. Health check on port X is in a 'warning' state.
    // Do nothing.

    // Case 3. Health check on port X is now passing.
    if (flyLogEntry.message.includes('is now passing')) {
      emitter.emit('deployments:success', [application, deployment])
    }
  }
}
