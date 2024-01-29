import DatabasesListener from '#listeners/databases_listener'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('databases:created', [DatabasesListener, 'onCreated'])
emitter.on('databases:deleted', [DatabasesListener, 'onDeleted'])

emitter.onError((event, error) => {
  logger.info({ err: error }, 'An error occured when emitting the event %s', event)
})
