import Database from '#models/database'
import FlyApi from './api/fly_api.js'

export default class FlyDatabasesConfigurationBuilder {
  protected readonly images: Map<'postgres' | 'mysql' | 'redis', string> = new Map([
    ['postgres', 'postgres:13-alpine'],
    ['mysql', 'mysql:8.0.32'],
    ['redis', 'flyio/redis:6.2.6'],
  ])

  private readonly flyApi: FlyApi = new FlyApi()

  public prepareDatabaseConfiguration(database: Database, volume: string) {
    const applicationName = this.flyApi.getFlyDatabaseName(database.slug)

    if (database.dbms === 'redis') {
      return {
        image: 'registry-1.docker.io/flyio/redis:6.2.6',
        env: {
          REDIS_PASSWORD: 'redis',
        },
        init: {},
        mounts: [
          {
            name: `${applicationName.replace('-', '_')}_data`,
            path: '/data',
            volume: volume,
          },
        ],
        services: [
          {
            protocol: 'tcp',
            internal_port: 6379,
            ports: [
              {
                port: 10000,
              },
            ],
            checks: [
              {
                dbms: 'tcp',
                interval: '30s',
                timeout: '2s',
                grace_period: '60s',
              },
            ],
            force_instance_key: null,
          },
        ],
        metrics: {
          port: 9091,
          path: '/metrics',
        },
        restart: {},
        guest: {
          cpu_kind: 'shared',
          cpus: 1,
          memory_mb: 256,
        },
      }
    }

    return {
      processes: this.prepareProcesses(database.dbms),
      guest: {
        cpu_kind: 'shared',
        memory_mb: 256,
        cpus: 1,
      },
      services: [
        {
          autostart: true,
          protocol: 'tcp',
          internal_port: this.preparePort(database.dbms),
          ports: [
            {
              port: this.preparePort(database.dbms),
              handlers: this.prepareHandlers(database.dbms),
            },
          ],
        },
      ],
      image: this.images.get(database.dbms),
      env: this.prepareEnvironmentVariables(database),
      mounts: [
        {
          name: `${applicationName.replace('-', '_')}_data`,
          path: this.prepareVolumePath(database.dbms),
          size_gb: 1,
          volume,
        },
      ],
    }
  }

  private prepareProcesses(dbms: 'postgres' | 'mysql' | 'redis') {
    if (dbms === 'mysql') {
      return [
        {
          cmd: [
            '--datadir',
            '/data/mysql',
            '--default-authentication-plugin',
            'mysql_native_password',
            '--performance-schema=OFF',
            '--innodb-buffer-pool-size',
            '64M',
          ],
        },
      ]
    }
    return undefined
  }

  private prepareEnvironmentVariables(database: Database): Record<string, string> {
    const env: Record<string, string> = {}

    switch (database.dbms) {
      case 'postgres':
        env.POSTGRES_DB = database.slug
        env.POSTGRES_USER = database.username
        env.POSTGRES_PASSWORD = database.password

        env.PGDATA = '/var/lib/postgresql/data/pgdata'

        break
      case 'mysql':
        env.MYSQL_DATABASE = database.slug
        env.MYSQL_USER = database.username
        env.MYSQL_PASSWORD = database.password
        env.MYSQL_RANDOM_ROOT_PASSWORD = 'yes'

        break

      case 'redis':
        env.REDIS_PASSWORD = database.password
        break
    }

    return env
  }

  private prepareVolumePath(dbms: 'postgres' | 'mysql' | 'redis') {
    switch (dbms) {
      case 'postgres':
        return '/var/lib/postgresql/data'
      case 'redis':
      case 'mysql':
        return '/data'
    }
  }

  private preparePort(dbms: 'postgres' | 'mysql' | 'redis') {
    switch (dbms) {
      case 'postgres':
        return 5432
      case 'mysql':
        return 3306
      case 'redis':
        return 6379
    }
  }

  private prepareHandlers(dbms: 'postgres' | 'mysql' | 'redis') {
    switch (dbms) {
      case 'postgres':
        return ['pg_tls']
      default:
        return []
    }
  }
}
