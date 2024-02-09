import Database from '#models/database'
import env from '#start/env'

export default class DockerDatabasesConfigurationBuilder {
  build(database: Database) {
    return {
      name: `citadel-${database.slug}`,
      Image: this.prepareImage(database),
      Env: this.prepareEnvironmentVariables(database),
      EndpointSpec: this.prepareEndpointSpec(database),
      NetworkingConfig: {
        EndpointsConfig: {
          traefik: {
            NetworkID: 'traefik',
          },
        },
      },
      Labels: this.prepareLabels(database),
    }
  }

  private prepareImage(database: Database): string {
    switch (database.dbms) {
      case 'postgres':
        return 'postgres:13-alpine'
      case 'mysql':
        return 'mysql:8.3.0'
      case 'redis':
        return 'redis:6-alpine'
    }
  }

  private prepareEnvironmentVariables(database: Database): `${string}=${string}`[] {
    const env: Record<string, string> = {}

    switch (database.dbms) {
      case 'postgres':
        env.POSTGRES_DB = database.name
        env.POSTGRES_USER = database.username
        env.POSTGRES_PASSWORD = database.password
        env.PG_PASSWORD = database.password

        break
      case 'mysql':
        env.MYSQL_DATABASE = database.name
        env.MYSQL_USER = database.username
        env.MYSQL_PASSWORD = database.password
        env.MYSQL_RANDOM_ROOT_PASSWORD = 'yes'

        break

      case 'redis':
        env.REDIS_PASSWORD = database.password
        break
    }

    return Object.entries(env).map(([key, value]) => (key + '=' + value) as `${string}=${string}`)
  }

  private prepareEndpointSpec(database: Database) {
    switch (database.dbms) {
      case 'postgres':
        return {
          ExposedPorts: [
            {
              Protocol: 'tcp',
              TargetPort: this.preparePort(database),
              PublishedPort: this.preparePort(database),
            },
          ],
        }
      case 'mysql':
        return {
          ExposedPorts: [
            {
              Protocol: 'tcp',
              TargetPort: this.preparePort(database),
              PublishedPort: this.preparePort(database),
            },
          ],
        }
      case 'redis':
        return {
          ExposedPorts: [
            {
              Protocol: 'tcp',
              TargetPort: this.preparePort(database),
              PublishedPort: this.preparePort(database),
            },
          ],
        }
    }
  }

  private preparePort(database: Database) {
    switch (database.dbms) {
      case 'postgres':
        return 5432
      case 'mysql':
        return 3306
      case 'redis':
        return 6379
    }
  }

  private prepareLabels(database: Database) {
    /**
     * These labels are used to expose the database
     * through the Traefik reverse proxy.
     */
    const host = `HostSNI(\`${database.hostname}\`)`
    const routerName = env.get('DOCKER_BUILDER_NAME_PREFIX', 'citadel-builder') + database.slug
    return {
      'traefik.enable': 'true',
      [`traefik.tcp.routers.${routerName}.rule`]: host,
      [`traefik.tcp.routers.${routerName}.entrypoints`]: database.dbms,
      [`traefik.tcp.services.${routerName}.loadbalancer.server.port`]:
        this.preparePort(database).toString(),
      [`traefik.tcp.routers.${routerName}.tls`]: 'true',
      [`traefik.tcp.routers.${routerName}.tls.certresolver`]: 'letsencrypt',
    }
  }
}
