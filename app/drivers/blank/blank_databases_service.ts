import { IDriverDatabasesService } from '#drivers/idriver'
import Database from '#models/database'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankDatabasesService implements IDriverDatabasesService {
  createDatabase(
    organization: Organization,
    project: Project,
    database: Database
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  deleteDatabase(
    organization: Organization,
    project: Project,
    database: Database
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
}
