import { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import { Docker } from 'node-docker-api'

export default class SwarmApplicationsService implements IDriverApplicationsService {
  constructor(private readonly docker: Docker) {}

  createApplication(_application: Application): void | Promise<void> {}

  deleteApplication(_application: Application): void | Promise<void> {
    // TODO: Delete all services related to this application
  }
}
