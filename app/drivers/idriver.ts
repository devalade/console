import Database from '#models/database'

export default interface IDriver {
  initializeDriver(): void | Promise<void>

  igniteApplication(config: {
    name: string
    image: string
    environmentVariables: Record<string, string>
    ports: Record<string, number>
  }): void | Promise<void>

  databases: IDriverDatabasesService
}

export interface IDriverDatabasesService {
  createDatabase(database: Database): void | Promise<void>
  deleteDatabase(database: Database): void | Promise<void>
}
