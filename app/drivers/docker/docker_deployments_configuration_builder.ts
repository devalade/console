import Application from '#models/application'
import env from '#start/env'

export default class DockerDeploymentsConfigurationBuilder {
  prepareBuilderContainerConfiguration(application: Application) {
    return {
      name: `${application.slug}-builder`,
      Image: env.get('BUILDER_IMAGE'),
      Env: this.prepareBuilderEnvironmentVariables(application),
      Labels: {
        'traefik.enable': 'false',
      },
      HostConfig: {
        AutoRemove: true,
        NetworkMode: 'host',
        Privileged: true,
      },
    }
  }

  private prepareBuilderEnvironmentVariables(application: Application): `${string}=${string}`[] {
    const environmentVariables = {
      S3_ENDPOINT: env.get('S3_ENDPOINT'),
      S3_BUCKET_NAME: env.get('S3_BUCKET'),
      S3_ACCESS_KEY_ID: env.get('S3_ACCESS_KEY'),
      S3_SECRET_ACCESS_KEY: env.get('S3_SECRET_KEY'),
      REGISTRY_HOST: env.get('REGISTRY_HOST'),
      REGISTRY_TOKEN: env.get('REGISTRY_TOKEN'),
      FILE_NAME: `${application.slug}.tar.gz`,
      IMAGE_NAME: application.slug,
    }
    return Object.entries(environmentVariables).map(
      ([key, value]) => (key + '=' + value) as `${string}=${string}`
    )
  }

  prepareContainerConfiguration(application: Application) {
    return {
      name: application.slug,
      Image: `${env.get('REGISTRY_HOST')}/${application.slug}:latest`,
      Env: Object.entries(application.environmentVariables).map(
        ([key, value]) => (key + '=' + value) as `${string}=${string}`
      ),
      Labels: this.prepareLabels(application),
      NetworkingConfig: {
        EndpointsConfig: {
          traefik: {
            NetworkID: 'traefik',
          },
        },
      },
    }
  }

  private prepareLabels(application: Application) {
    if (!application.environmentVariables.PORT) {
      return {}
    }

    return {
      'traefik.enable': 'true',
      [`traefik.http.routers.${application.slug}.rule`]: `Host(\`${application.slug}.${env.get('TRAEFIK_WILDCARD_DOMAIN')}\`)`,
      [`traefik.http.routers.${application.slug}.entrypoints`]: 'websecure',
      [`traefik.http.routers.${application.slug}.tls.certresolver`]: 'myresolver',
      [`traefik.http.services.${application.slug}.loadbalancer.server.port`]:
        application.environmentVariables.PORT,
    }
  }
}
