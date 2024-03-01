import { IDriverDevMachinesService } from '#drivers/idriver'
import DevMachine from '#models/dev_machine'
import Organization from '#models/organization'
import Project from '#models/project'
import env from '#start/env'
import FlyApi from './api/fly_api.js'
import { AddressType } from './api/fly_networks_api.js'
import FlyDevMachinesConfigurationBuilder from './fly_dev_machines_configuration_builder.js'

export default class FlyDevMachinesService implements IDriverDevMachinesService {
  #flyApi = new FlyApi()
  #flyDevMachinesConfigurationBuilder = new FlyDevMachinesConfigurationBuilder()

  async createDevMachine(_organization: Organization, _project: Project, devMachine: DevMachine) {
    const flyDevMachineApplicationName =
      env.get('FLY_DEV_MACHINE_PREFIX', 'citadel-machine') + '-' + devMachine.slug

    await this.#flyApi.apps.createApplication({
      app_name: flyDevMachineApplicationName,
      org_slug: env.get('FLY_ORG', 'personal'),
    })

    await this.#flyApi.networks.allocateIpAddress({
      appId: flyDevMachineApplicationName,
      type: AddressType.shared_v4,
    })

    await this.#flyApi.networks.allocateIpAddress({
      appId: flyDevMachineApplicationName,
      type: AddressType.v6,
    })

    const { id: volumeId } = await this.#flyApi.volumes.createVolume(flyDevMachineApplicationName, {
      name: 'data',
      size_gb: devMachine.resourcesConfig === 'standard' ? 10 : 30,
      region: 'lhr',
      machines_only: true,
    })

    await this.#flyApi.machines.createMachine(flyDevMachineApplicationName, {
      config: this.#flyDevMachinesConfigurationBuilder.prepareDevMachineConfiguration(
        devMachine,
        volumeId
      ),
    })
  }

  async deleteDevMachine(_organization: Organization, _project: Project, devMachine: DevMachine) {
    const flyDevMachineApplicationName =
      env.get('FLY_DEV_MACHINE_PREFIX', 'citadel-machine') + '-' + devMachine.slug

    await this.#flyApi.apps.deleteApplication(flyDevMachineApplicationName)
  }
}
