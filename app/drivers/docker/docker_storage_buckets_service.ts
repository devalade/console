import { IDriverStorageBucketsService } from '#drivers/idriver'
import Organization from '#models/organization'
import Project from '#models/project'
import * as Minio from 'minio'
import env from '#start/env'
import StorageBucket from '#models/storage_bucket'

export default class DockerStorageBucketsService implements IDriverStorageBucketsService {
  private minioClient = new Minio.Client({
    endPoint: env.get('S3_ENDPOINT').replace('http://', '').replace('https://', '').split(':')[0],
    useSSL: env.get('NODE_ENV') == 'production',
    accessKey: env.get('S3_ACCESS_KEY'),
    secretKey: env.get('S3_SECRET_KEY'),
  })

  createStorageBucket(_organization: Organization, _project: Project, name: string) {
    this.minioClient.makeBucket(name, env.get('S3_REGION'), function (error) {
      if (error) {
        throw new Error('Error creating bucket: ' + error)
      }
    })

    /*
      TODO: https://github.com/SoftwareCitadel/console/issues/24
      It'd be great to create a specific pair of keys for each bucket,
      with a policy that only allows access to that bucket.
    */

    return {
      host: env.get('S3_ENDPOINT'),
      keyId: env.get('S3_ACCESS_KEY'),
      secretKey: env.get('S3_SECRET_KEY'),
    }
  }

  getStorageBucketSize(
    _organization: Organization,
    _project: Project,
    _storageBucket: StorageBucket
  ) {
    return 0
  }

  async deleteStorageBucket(
    _organization: Organization,
    _project: Project,
    storageBucket: StorageBucket
  ) {
    await this.minioClient.removeBucket(storageBucket.slug)
  }
}
