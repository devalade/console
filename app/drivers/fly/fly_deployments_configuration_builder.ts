import { inject } from '@adonisjs/core'
import FlyApi from './api/fly_api.js'
import Deployment from '#models/deployment'
import env from '#start/env'
import Application from '#models/application'

@inject()
export default class FlyDeploymentsConfigurationBuilder {
  constructor(private readonly flyApi: FlyApi) {}

  prepareBuilderConfiguration(deployment: Deployment) {
    return {
      auto_destroy: true,
      restart: { policy: 'no' },
      Image: env.get('BUILDER_IMAGE'),
      env: this.prepareBuilderEnvironmentVariables(deployment.application),
      guest: {
        cpu_kind: 'shared',
        cpus: 2,
        memory_mb: 4096,
      },
    }
  }

  prepareApplicationConfiguration(application: Application, noHealthCheck = false) {
    const flyApplicationName = this.flyApi.getFlyApplicationName(application.slug)
    const port = parseInt(application.environmentVariables.PORT)

    const checks: Record<string, any> = {}
    if (port && !noHealthCheck) {
      checks.httpget = {
        type: 'http',
        port,
        method: 'GET',
        path: '/',
        interval: '30s',
        timeout: '20s',
      }
    }

    const services: Array<Record<string, any>> = []
    if (port) {
      services.push({
        ports: [
          {
            port: 443,
            handlers: ['tls', 'http'],
          },
          { port: 80, handlers: ['http'], force_https: true },
        ],
        protocol: 'tcp',
        internal_port: port,
      })
    }

    return {
      image: `registry.fly.io/${flyApplicationName}:latest`,
      env: application.environmentVariables,
      services,
      checks,
    }
  }

  private prepareBuilderEnvironmentVariables(application: Application) {
    const flyApplicationName = this.flyApi.getFlyApplicationName(application.slug)

    return {
      S3_ENDPOINT: env.get('S3_ENDPOINT'),
      S3_BUCKET_NAME: env.get('S3_BUCKET'),
      S3_ACCESS_KEY_ID: env.get('S3_ACCESS_KEY'),
      S3_SECRET_ACCESS_KEY: env.get('S3_SECRET_KEY'),
      REGISTRY_HOST: 'registry.fly.io',
      REGISTRY_TOKEN: env.get('REGISTRY_TOKEN'),
      FILE_NAME: `${application.slug}.tar.gz`,
      IMAGE_NAME: flyApplicationName,
    }
  }
}
