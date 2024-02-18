import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankDeploymentsService implements IDriverDeploymentsService {
  igniteBuilder(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  igniteApplication(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  shouldMonitorHealthcheck(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): boolean | Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
