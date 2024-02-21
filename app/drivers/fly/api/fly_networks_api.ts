import logger from '@adonisjs/core/services/logger'
import FlyApiCaller from './fly_api_caller.js'

export default class FlyNetworksApi {
  constructor(private readonly apiCaller: FlyApiCaller) {}

  public async allocateIpAddress(input: AllocateIPAddressInput): Promise<string> {
    try {
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
    } catch (error) {
      logger.error('Failed to allocate IP address', error)
      return ''
    }
  }

  public async allocateSharedIpAddress(input: AllocateIPAddressInput): Promise<string> {
    try {
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
    } catch (error) {
      logger.error('Failed to allocate shared IP address', error)
      return ''
    }
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
