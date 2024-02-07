import { FLY_APPLICATION_NAME_PREFIX, FLY_BUILDER_NAME_PREFIX } from '#drivers/fly/api/fly_api'
import { FlyLogEntry } from '#drivers/fly/types'
import Application from '#models/application'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

export default class FlyWebhooksController {
  public async handleIncomingLogs({ request, response }: HttpContext) {
    if (request.header('Authorization') !== `Bearer ${env.get('FLY_WEBHOOK_SECRET')}`) {
      return response.unauthorized()
    }

    for (const logEntry of request.body() as FlyLogEntry[]) {
      if (
        !logEntry.fly.app.name.startsWith(FLY_APPLICATION_NAME_PREFIX) &&
        !logEntry.fly.app.name.startsWith(FLY_BUILDER_NAME_PREFIX)
      ) {
        continue
      }

      emitter.emit(`fly:log:${logEntry.fly.app.name}`, {
        message: logEntry.message,
        timestamp: logEntry.timestamp,
      })

      const applicationSlug: string = logEntry.fly.app.name
        .replace('citadel-builder-', '')
        .replace('citadel-app-', '')
      const application = await Application.findBy('slug', applicationSlug)
      if (!application) {
        continue
      }

      if (
        logEntry.fly.app.name.startsWith(FLY_BUILDER_NAME_PREFIX) &&
        logEntry.message.includes('Main child exited normally with code:')
      ) {
        const event = logEntry.message.includes('1') ? 'build:unsuccessful' : 'build:successful'
        // TODO: emitter.emit(event, { application, machineId: logEntry.fly.app.instance })
        return response.noContent()
      }

      if (logEntry.message.includes('machine has reached its max restart count')) {
        // TODO: emitter.emit('deployment:failed', { application })
        return response.noContent()
      }

      if (logEntry.message.includes('Health check')) {
        await this.handleHealthcheckLogEntry(application, logEntry)
        return response.noContent()
      }

      if (
        logEntry.fly.app.name.startsWith(FLY_APPLICATION_NAME_PREFIX) &&
        !application.environmentVariables.PORT &&
        logEntry.message.includes('[fly api proxy] listening at /.fly/api')
      ) {
        // TODO:  emitter.emit('deployment:succeeded', { application, machineId: logEntry.fly.app.instance })
        return response.noContent()
      }
    }

    return response.noContent()
  }

  private async handleHealthcheckLogEntry(application: Application, flyLogEntry: FlyLogEntry) {
    const { message } = flyLogEntry
    // Case 1. Health check on port X has failed.
    if (message.includes('has failed')) {
      // TODO: emitter.emit('deployment:failed', { application })
    }

    // Case 2. Health check on port X is in a 'warning' state.
    // Do nothing.

    // Case 3. Health check on port X is now passing.
    if (message.includes('is now passing')) {
      // TODO: emitter.emit('deployment:succeeded', { application, machineId: flyLogEntry.fly.app.instance })
    }
  }
}
