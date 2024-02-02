import type { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'

export default class FlyDatabasesService implements IDriverDatabasesService {
  createDatabase(_database: Database) {}
  deleteDatabase(_database: Database) {}
}
