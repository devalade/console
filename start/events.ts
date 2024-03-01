import ApplicationsListener from '#listeners/applications_listener'
import BuildsListener from '#listeners/builds_listener'
import DatabasesListener from '#listeners/databases_listener'
import DeploymentsListener from '#listeners/deployments_listener'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'
import string from '@adonisjs/core/helpers/string'
import MessagesListener from '#listeners/messages_listener'

emitter.on('http:request_completed', (event) => {
  const method = event.ctx.request.method()
  const url = event.ctx.request.url(true)
  const duration = event.duration

  try {
    // @ts-ignore (this can be safely ignored)
    const handler = event.ctx.route!.handler.name

    /**
     * Print the route handler reference when available.
     */
    logger.info(`${method} [${handler}] ${url}: ${string.prettyHrTime(duration)}`)
  } catch (error) {
    logger.info(`${method} ${url}: ${string.prettyHrTime(duration)}`)
  }
})

emitter.on('db:query', db.prettyPrint)

emitter.on('applications:created', [ApplicationsListener, 'onDeleted'])
emitter.on('applications:deleted', [ApplicationsListener, 'onDeleted'])

emitter.on('databases:created', [DatabasesListener, 'onCreated'])
emitter.on('databases:deleted', [DatabasesListener, 'onDeleted'])

emitter.on('builds:success', [BuildsListener, 'onSuccess'])
emitter.on('builds:failure', [BuildsListener, 'onFailure'])

emitter.on('deployments:created', [DeploymentsListener, 'onCreated'])
emitter.on('deployments:success', [DeploymentsListener, 'onSuccess'])
emitter.on('deployments:failure', [DeploymentsListener, 'onFailure'])

emitter.on('messages:created', [MessagesListener, 'onCreated'])

emitter.onError((event, error) => {
  logger.info({ err: error }, 'An error occured when emitting the event %s', event)
})
