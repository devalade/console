import ApplicationsListener from '#listeners/applications_listener'
import DatabasesListener from '#listeners/databases_listener'
import DeploymentsListener from '#listeners/deployments_listener'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('applications:created', [ApplicationsListener, 'onDeleted'])
emitter.on('applications:deleted', [ApplicationsListener, 'onDeleted'])

emitter.on('databases:created', [DatabasesListener, 'onCreated'])
emitter.on('databases:deleted', [DatabasesListener, 'onDeleted'])

emitter.on('deployments:created', [DeploymentsListener, 'onCreated'])

emitter.onError((event, error) => {
  logger.info({ err: error }, 'An error occured when emitting the event %s', event)
})
