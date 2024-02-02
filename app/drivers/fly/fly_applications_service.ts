import type { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import type { Response } from '@adonisjs/core/http'

export default class FlyApplicationsService implements IDriverApplicationsService {
  createApplication(_application: Application): void | Promise<void> {}

  deleteApplication(_application: Application): void | Promise<void> {}

  streamLogs(_application: Application, _response: Response, _scope: 'application' | 'builder') {}
}
