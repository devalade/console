import Driver from '#drivers/driver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'

export default class DeploymentsListener {
  async onCreated([application, deployment]: [Application, Deployment]) {
    const driver = Driver.getDriver()
    await driver.deployments.igniteBuilder(application, deployment)
  }

  async onSuccess([_, deployment]: [Application, Deployment]) {
    deployment.status = DeploymentStatus.Success
    await deployment.save()
  }

  async onFailure([]: [Application, Deployment]) {}
}
