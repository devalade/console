import DevMachine from '#models/dev_machine'

export default class FlyDevMachinesConfigurationBuilder {
  #MACHINE_DOCKER_IMAGE = 'registry.fly.io/citadel-machine:latest'

  prepareDevMachineConfiguration(devMachine: DevMachine, volumeId: string) {
    const httpOptions = {
      response: {
        headers: {
          'fly-request-id': false,
          'server': 'Software Citadel',
          'via': false,
        },
      },
    }
    return {
      init: {},
      guest: {
        cpu_kind: 'shared',
        cpus: devMachine.resourcesConfig === 'standard' ? 4 : 8,
        memory_mb: devMachine.resourcesConfig === 'standard' ? 8192 : 16384,
      },
      mounts: [
        {
          path: '/project',
          volume: volumeId,
        },
      ],
      services: [
        {
          // Add SSH
          protocol: 'tcp',
          internal_port: 22,
          ports: [{ port: 22, handlers: ['tls'] }],
        },
        {
          protocol: 'tcp',
          internal_port: 9090,
          ports: [
            { port: 443, handlers: ['tls', 'http'], http_options: httpOptions },
            { port: 80, handlers: ['http'], http_options: httpOptions },
          ],
          checks: [
            {
              type: 'tcp',
              interval: '10s',
              timeout: '2s',
            },
          ],
          force_instance_key: null,
        },
        {
          protocol: 'tcp',
          internal_port: 4000,
          ports: [
            {
              port: 4000,
              handlers: ['tls'],
            },
          ],
          force_instance_key: null,
        },
      ],
      image: this.#MACHINE_DOCKER_IMAGE,
      restart: { policy: 'always' },
      env: { PASSWORD: devMachine.password },
      dns: {},
    }
  }
}
