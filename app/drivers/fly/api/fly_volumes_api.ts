import FlyApiCaller from './fly_api_caller.js'

export default class FlyVolumesApi {
  constructor(private readonly apiCaller: FlyApiCaller) {}

  public async createVolume(appId: string, payload: CreateVolumePayload) {
    return await this.apiCaller.callRestApi('POST', `/apps/${appId}/volumes`, payload)
  }

  public async listVolumes(appId: string): Promise<Array<{ id: string; size_gb: number }>> {
    return await this.apiCaller.callRestApi('GET', `/apps/${appId}/volumes`)
  }
}

export type CreateVolumePayload = {
  compute?: {
    cpu_kind?: string
    cpus?: number
    gpu_kind?: string
    kernel_args?: Array<string>
    memory_mb?: number
  }
  encrypted?: boolean
  fstype?: string
  machines_only?: boolean
  name?: string
  region?: string
  require_unique_zone?: boolean
  size_gb?: number
  snapshot_id?: string
  source_volume_id?: string
}
