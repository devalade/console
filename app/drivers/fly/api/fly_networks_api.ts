import FlyApiCaller from './fly_api_caller.js'

export default class FlyNetworksApi {
  constructor(private readonly apiCaller: FlyApiCaller) {}

  public async allocateIpAddress(input: AllocateIPAddressInput): Promise<string> {
    const allocateIpAddressQuery = `mutation($input: AllocateIPAddressInput!) {
      allocateIpAddress(input: $input) {
        ipAddress {
          id
          address
          type
          region
          createdAt
        }
      }
    }`

    const response = await this.apiCaller.callGraphQLApi({
      query: allocateIpAddressQuery,
      variables: { input },
    })

    return response.allocateIpAddress.ipAddress?.address as string
  }

  public async allocateSharedIpAddress(input: AllocateIPAddressInput): Promise<string> {
    const allocateSharedIpAddressQuery = `mutation($input: AllocateIPAddressInput!) {
      allocateIpAddress(input: $input) {
        app {
          sharedIpAddress
        }
      }
    }`

    const response = await this.apiCaller.callGraphQLApi({
      query: allocateSharedIpAddressQuery,
      variables: { input },
    })

    return response.allocateIpAddress.app.sharedIpAddress
  }
}

export interface AllocateIPAddressInput {
  appId: string
  type: AddressType
  organizationId?: string
  region?: string
  network?: string
}

export enum AddressType {
  v4 = 'v4',
  v6 = 'v6',
  private_v6 = 'private_v6',
  shared_v4 = 'shared_v4',
}
