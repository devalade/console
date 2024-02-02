import FlyApiCaller from './fly_api_caller.js'

export default class FlyAppsApi {
  constructor(private readonly apiCaller: FlyApiCaller) {}

  public async createApplication(input: CreateApplicationInput) {
    return this.apiCaller.callRestApi('POST', '/apps', input, true)
  }

  public async deleteApplication(appName: string) {
    return this.apiCaller.callRestApi('DELETE', `/apps/${appName}`, null, true)
  }
}

interface CreateApplicationInput {
  app_name: string
  network?: string
  org_slug: string
}
