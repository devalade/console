import Driver from '#drivers/driver'
import Application from '#models/application'

export default class ApplicationsListener {
  async onCreated(application: Application) {
    const driver = Driver.getDriver()
    await driver.applications.createApplication(application)
  }

  async onDeleted(application: Application) {
    const driver = Driver.getDriver()
    await driver.applications.deleteApplication(application)
  }
}
