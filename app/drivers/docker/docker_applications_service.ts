import { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import { Docker } from 'node-docker-api'
import type { Response } from '@adonisjs/core/http'
import { CertificateStatus } from '#models/certificate'

export default class DockerApplicationsService implements IDriverApplicationsService {
  constructor(private readonly docker: Docker) {}

  createApplication(_application: Application): void | Promise<void> {}

  deleteApplication(_application: Application): void | Promise<void> {
    // TODO: Delete all containers related to this application
  }

  async streamLogs(application: Application, response: Response, scope: 'application' | 'builder') {
    let serviceName = application.slug
    if (scope === 'builder') {
      serviceName = `${application.slug}-builder`
    }

    for (let i = 0; i < 3; i++) {
      const containerAlreadyExists = await this.docker.container.list({
        all: true,
        filters: {
          name: [serviceName],
        },
      })
      if (containerAlreadyExists.length > 0) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const container = this.docker.container.get(serviceName)

    const logsStream: any = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      timestamps: true,
    })

    logsStream.on('data', (info: Buffer) => {
      const data = info.toString('utf8')
      const firstNumberIdx = data.split('').findIndex((char) => !isNaN(parseInt(char)))
      const firstSpaceIdx = data.indexOf(' ')
      const timestamp = data.substring(firstNumberIdx, firstSpaceIdx)
      const message = data.substring(firstSpaceIdx + 1)
      response.response.write(`data: ${timestamp} ${message}\n\n`)
      response.response.flushHeaders()
    })
  }

  createCertificate(application: Application, hostname: string): void | Promise<void> {}

  checkDnsConfiguration(application: Application, hostname: string): CertificateStatus {
    return 'unconfigured'
  }

  deleteCertificate(application: Application, hostname: string): void | Promise<void> {}
}
