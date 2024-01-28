import Database from '#models/database'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'databases:created': Database
    'databases:deleted': Database
  }
}
