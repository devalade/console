import { IDriverStorageBucketsService } from '#drivers/idriver'
import Organization from '#models/organization'
import Project from '#models/project'
import StorageBucket from '#models/storage_bucket'
import { StorageBucketFile } from '#types/storage'

export default class BlankStorageBucketsService implements IDriverStorageBucketsService {
  listFilesAndComputeSize(
    _organization: Organization,
    _project: Project,
    _storageBucket: StorageBucket
  ):
    | { bucketSize: number; files: StorageBucketFile[] }
    | Promise<{ bucketSize: number; files: StorageBucketFile[] }> {
    throw new Error('Method not implemented.')
  }
  deleteStorageBucket(
    _organization: Organization,
    _project: Project,
    _storageBucket: StorageBucket
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  uploadFile(
    _organization: Organization,
    _project: Project,
    _storageBucket: StorageBucket,
    _filePath: string,
    _tmpPath: string,
    _contentType: string
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  downloadFile(
    _organization: Organization,
    _project: Project,
    _storageBucket: StorageBucket,
    _filename: any
  ): { file: string; contentType: string } | Promise<{ file: string; contentType: string }> {
    throw new Error('Method not implemented.')
  }
  deleteFile(
    _organization: Organization,
    _project: Project,
    _bucket: StorageBucket,
    _filename: string
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  createStorageBucket(
    _organization: Organization,
    _project: Project,
    _name: string
  ):
    | { host: string; keyId: string; secretKey: string }
    | Promise<{ host: string; keyId: string; secretKey: string }> {
    throw new Error('Method not implemented.')
  }
}
