import Driver from '#drivers/driver'
import Database from '#models/database'
import Organization from '#models/organization'
import Project from '#models/project'

export default class DatabasesListener {
  async onCreated([organization, project, database]: [Organization, Project, Database]) {
    const driver = Driver.getDriver()
    await driver.databases.createDatabase(organization, project, database)
  }

  async onDeleted([organization, project, database]: [Organization, Project, Database]) {
    const driver = Driver.getDriver()
    await driver.databases.deleteDatabase(organization, project, database)
  }
}
