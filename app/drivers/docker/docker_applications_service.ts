import { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import { Docker } from 'node-docker-api'
import type { Response } from '@adonisjs/core/http'
import Certificate, { CertificateStatus } from '#models/certificate'
import emitter from '@adonisjs/core/services/emitter'
import Deployment, { DeploymentStatus } from '#models/deployment'
import { DnsEntries } from '#types/dns'
import Driver from '#drivers/driver'
import DockerDriver from './docker_driver.js'
import dns from 'dns/promises'
import env from '#start/env'
import Organization from '#models/organization'
import Project from '#models/project'

export default class DockerApplicationsService implements IDriverApplicationsService {
  constructor(private readonly docker: Docker) {}

  createApplication(_organization: Organization, _project: Project, _application: Application) {}

  async deleteApplication(
    _organization: Organization,
    _project: Project,
    application: Application
  ) {
    try {
      const container = this.docker.container.get(application.slug)
      await container.delete({ force: true })
    } catch (error) {
      console.error(`[DockerApplicationsService] Error deleting container: ${error.message}`)
    }

    try {
      const container = this.docker.container.get(application.slug + '-builder')
      await container.delete({ force: true })
    } catch (error) {
      console.error(`[DockerApplicationsService] Error deleting container: ${error.message}`)
    }
  }

  async streamLogs(
    _organization: Organization,
    _project: Project,
    application: Application,
    response: Response,
    scope: 'application' | 'builder'
  ) {
    let serviceName: string
    if (scope === 'builder') {
      serviceName = `${env.get('DOCKER_BUILDER_NAME_PREFIX', 'citadel-builder')}-${application.slug}-builder`
    } else {
      serviceName = `${env.get('DOCKER_APPLICATION_NAME_PREFIX', 'citadel-app')}-${application.slug}`
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
      if (!timestamp.trim() || !message.trim()) {
        return
      }
      response.response.write(`data: ${timestamp} | ${message}\n\n`)
      response.response.flushHeaders()
    })

    emitter.on(`deployments:updated:${application.slug}`, (deployment: Deployment) => {
      if (
        deployment.status !== DeploymentStatus.Deploying &&
        deployment.status !== DeploymentStatus.BuildFailed
      ) {
        return
      }
      const timestamp = deployment.updatedAt.toISO()
      const message = `${timestamp} | ${deployment.status === DeploymentStatus.Deploying ? 'Deployment successful' : 'Deployment failed'}`
      response.response.write(`data: ${message}\n\n`)
      response.response.flushHeaders()
    })
  }

  private async updateContainerForCertificateUpdate(application: Application) {
    /*
     * Docker does not allow to update labels to a running container.
     * We need to stop the container, update the labels and start it again.
     * Without this trick, Traefik will not be able to pick up the new certificate.
     */
    const driver = Driver.getDriver() as DockerDriver
    await driver.deployments.igniteContainerForApplication(application)
  }

  async createCertificate(
    _organization: Organization,
    _project: Project,
    application: Application,
    hostname: string
  ): Promise<DnsEntries> {
    await this.updateContainerForCertificateUpdate(application)

    const driver = Driver.getDriver() as DockerDriver

    return [
      {
        type: 'A',
        name: hostname,
        value: driver.ipv4,
      },
    ]
  }

  async checkDnsConfiguration(
    _organization: Organization,
    _project: Project,
    _application: Application,
    certificate: Certificate
  ): Promise<CertificateStatus> {
    try {
      const dnsRecords = await dns.resolve4(certificate.domain)
      for (const dnsRecord of dnsRecords) {
        if (dnsRecord === (Driver.getDriver() as DockerDriver).ipv4) {
          return 'configured'
        }
      }

      return 'unconfigured'
    } catch (error) {
      return 'unconfigured'
    }
  }

  async deleteCertificate(
    _organization: Organization,
    _project: Project,
    application: Application,
    _hostname: string
  ) {
    await this.updateContainerForCertificateUpdate(application)
  }
}
