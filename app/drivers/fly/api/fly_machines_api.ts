import FlyApiCaller from './fly_api_caller.js'

export default class FlyMachinesApi {
  constructor(private readonly apiCaller: FlyApiCaller) {}

  public async listMachines(appName: string, includeDeleted: boolean = false) {
    return this.apiCaller.callRestApi(
      'GET',
      `/apps/${appName}/machines?include_deleted=${includeDeleted}`
    )
  }

  public async createMachine(appName: string, input: CreateMachinePayload) {
    return this.apiCaller.callRestApi('POST', `/apps/${appName}/machines`, input)
  }

  public async updateMachine(appName: string, machineId: string, input: CreateMachinePayload) {
    return this.apiCaller.callRestApi('POST', `/apps/${appName}/machines/${machineId}`, input)
  }

  public async waitForMachineToBeStopped(appName: string, machineId: string) {
    return this.apiCaller.callRestApi(
      'GET',
      `/apps/${appName}/machines/${machineId}/wait?state=stopped`
    )
  }

  public async stopMachine(appName: string, machineId: string) {
    return this.apiCaller.callRestApi('POST', `/apps/${appName}/machines/${machineId}/stop`)
  }

  public async deleteMachine(appName: string, machineId: string) {
    return this.apiCaller.callRestApi('DELETE', `/apps/${appName}/machines/${machineId}?kill=true`)
  }

  public async getMachine(appName: string, machineId: string) {
    return this.apiCaller.callRestApi('GET', `/apps/${appName}/machines/${machineId}`)
  }

  public async executeCommand(
    appName: string,
    machineId: string,
    command: string
  ): Promise<{
    stdout: string
    stderr: string
    exit_code: number
    exit_signal: number
  }> {
    return this.apiCaller.callRestApi('POST', `/apps/${appName}/machines/${machineId}/exec`, {
      cmd: command,
    })
  }

  public async waitForMachineToBeStarted(appName: string, machineId: string) {
    return this.apiCaller.callRestApi(
      'GET',
      `/apps/${appName}/machines/${machineId}/wait?state=started`
    )
  }
}

export type CreateMachinePayload = any
