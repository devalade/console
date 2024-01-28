import Database from '#models/database'

export default class DatabasesListener {
  async onCreated(database: Database) {}

  async onDeleted(database: Database) {}
}
