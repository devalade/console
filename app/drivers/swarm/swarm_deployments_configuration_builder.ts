import Application from '#models/application'
import Deployment from '#models/deployment'
import env from '#start/env'

export default class SwarmDeploymentsConfigurationBuilder {
  build(application: Application, deployment: Deployment) {
    return {
      name: `${application.slug}-${deployment.id}-builder`,
      TaskTemplate: {
        ContainerSpec: {
          Image: env.get('BUILDER_IMAGE'),
          Env: this.prepareBuilderEnvironmentVariables(application),
        },
        RestartPolicy: {
          Name: 'no',
        },
      },
      Networks: [{ Target: 'host' }],
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
}
