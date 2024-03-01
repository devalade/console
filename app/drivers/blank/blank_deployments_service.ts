import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankDeploymentsService implements IDriverDeploymentsService {
  igniteBuilder(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _deployment: Deployment
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  igniteApplication(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _deployment: Deployment
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  shouldMonitorHealthcheck(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _deployment: Deployment
  ): boolean | Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
