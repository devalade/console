import Database from '#models/database'

export default class DockerDatabasesConfigurationBuilder {
  build(database: Database) {
    return {
      name: `citadel-${database.slug}`,
      TaskTemplate: {
        ContainerSpec: {
          Image: this.prepareImage(database),
          Env: this.prepareEnvironmentVariables(database),
        },
      },
      EndpointSpec: this.prepareEndpointSpec(database),
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
              TargetPort: 5432,
              PublishedPort: 5432,
            },
          ],
        }
      case 'mysql':
        return {
          ExposedPorts: [
            {
              Protocol: 'tcp',
              TargetPort: 3306,
              PublishedPort: 3306,
            },
          ],
        }
      case 'redis':
        return {
          ExposedPorts: [
            {
              Protocol: 'tcp',
              TargetPort: 6379,
              PublishedPort: 6379,
            },
          ],
        }
    }
  }

  private prepareLabels(database: Database) {
    return {}
  }
}
