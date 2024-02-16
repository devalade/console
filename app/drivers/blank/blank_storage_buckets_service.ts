import { IDriverStorageBucketsService } from '#drivers/idriver'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankStorageBucketsService implements IDriverStorageBucketsService {
  createStorageBucket(
    _organization: Organization,
    _project: Project,
    _name: string
  ):
    | { host: string; keyId: string; secretKey: string }
    | Promise<{ host: string; keyId: string; secretKey: string }> {
    throw new Error('Method not implemented.')
  }

  deleteStorageBucket(
    _organization: Organization,
    _project: Project,
    _name: string
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
}
