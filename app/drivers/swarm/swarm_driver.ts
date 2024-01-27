import { Docker } from 'node-docker-api'
import env from '#start/env'
import IDriver from '../idriver.js'

export default class SwarmDriver implements IDriver {
  private readonly docker: Docker = new Docker({
    socketPath: env.get('DOCKER_SOCKET_PATH', '/var/run/docker.sock'),
  })

  private async initializeSwarmIfNotInitialized() {
    try {
      await this.docker.swarm.status()
    } catch (error) {
      if (error.statusCode === 503) {
        await this.docker.swarm.init({
          ListenAddr: '0.0.0.0:2377',
        })
      } else {
        throw error
      }
    }
  }

  async initializeDriver() {
    await this.initializeSwarmIfNotInitialized()
  }

  async igniteApplication(config: {
    name: string
    image: string
    environmentVariables: Record<string, string>
    ports: Record<string, number>
  }) {
    await this.docker.container.create({
      name: config.name,
      Image: config.image,
      Labels: {
        'traefik.enable': 'true',
        [`traefik.http.routers.${config.name}.rule`]: `Host(\`${config.name}.beaulieu.land\`)`,
        [`traefik.http.routers.${config.name}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${config.name}.tls.certresolver`]: 'myresolver',
      },
      Env: Object.entries(config.environmentVariables).map(([key, value]) => `${key}=${value}`),
      NetworkingConfig: {
        EndpointsConfig: {
          traefik: {
            NetworkID: 'traefik',
          },
        },
      },
    })

    await this.docker.container.get(config.name).start()
  }
}
