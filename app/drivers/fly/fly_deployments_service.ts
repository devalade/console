import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'

export default class FlyDeploymentsService implements IDriverDeploymentsService {
  igniteBuilder(_application: Application, _deployment: Deployment) {}
  igniteApplication(_application: Application, _deployment: Deployment) {}
}
