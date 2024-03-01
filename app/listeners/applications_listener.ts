import Driver from '#drivers/driver'
import Application from '#models/application'
import Organization from '#models/organization'
import Project from '#models/project'

export default class ApplicationsListener {
  async onCreated([organization, project, application]: [Organization, Project, Application]) {
    const driver = Driver.getDriver()
    await driver.applications.createApplication(organization, project, application)
  }

  async onDeleted([organization, project, application]: [Organization, Project, Application]) {
    const driver = Driver.getDriver()
    await driver.applications.deleteApplication(organization, project, application)
  }
}
