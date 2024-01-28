import DatabasesListener from '#listeners/databases_listener'
import emitter from '@adonisjs/core/services/emitter'

emitter.on('databases:created', [DatabasesListener, 'onCreated'])
emitter.on('databases:deleted', [DatabasesListener, 'onDeleted'])
