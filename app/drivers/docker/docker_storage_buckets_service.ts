import { IDriverStorageBucketsService } from '#drivers/idriver'
import Organization from '#models/organization'
import Project from '#models/project'
import * as Minio from 'minio'
import env from '#start/env'
import StorageBucket from '#models/storage_bucket'
import logger from '@adonisjs/core/services/logger'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import * as fs from 'fs/promises'
import { StorageBucketFile } from '#types/storage'

export default class DockerStorageBucketsService implements IDriverStorageBucketsService {
  private minioClient = new Minio.Client({
    endPoint: env.get('S3_ENDPOINT').replace('http://', '').replace('https://', '').split(':')[0],
    port: parseInt(
      env.get('S3_ENDPOINT').replace('http://', '').replace('https://', '').split(':')[1]
    ),
    useSSL: env.get('NODE_ENV') == 'production',
    accessKey: env.get('S3_ACCESS_KEY'),
    secretKey: env.get('S3_SECRET_KEY'),
  })

  private s3Client = new S3Client({
    endpoint: env.get('S3_ENDPOINT'),
    region: env.get('S3_REGION'),
    credentials: {
      accessKeyId: env.get('S3_ACCESS_KEY'),
      secretAccessKey: env.get('S3_SECRET_KEY'),
    },
  })

  createStorageBucket(_organization: Organization, _project: Project, name: string) {
    this.minioClient.makeBucket(name, env.get('S3_REGION'), function (error) {
      if (error) {
        logger.error(error, 'Error creating bucket')
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

  private async listFiles(bucketId: string): Promise<Array<StorageBucketFile>> {
    try {
      const data = await this.s3Client.send(
        new ListObjectsCommand({
          Bucket: bucketId,
        })
      )

      const files: Array<StorageBucketFile> = []
      for (const object of data.Contents || []) {
        const headObject = await this.s3Client.send(
          new HeadObjectCommand({ Bucket: bucketId, Key: object.Key })
        )
        files.push({
          size: object.Size!,
          filename: object.Key!,
          updatedAt: object.LastModified!,
          type: headObject.ContentType!,
        })
      }

      return files.sort((a, b) => {
        if (a.filename < b.filename) return -1
        if (a.filename > b.filename) return 1
        return 0
      })
    } catch (error) {
      logger.error('Error listing files from bucket', error)
      return []
    }
  }

  async listFilesAndComputeSize(
    _organization: Organization,
    _project: Project,
    storageBucket: StorageBucket
  ): Promise<{ files: StorageBucketFile[]; bucketSize: number }> {
    const files = await this.listFiles(storageBucket.slug)
    return {
      files,
      bucketSize: files.reduce((acc, file) => acc + file.size, 0),
    }
  }

  async deleteStorageBucket(
    _organization: Organization,
    _project: Project,
    storageBucket: StorageBucket
  ) {
    try {
      await this.minioClient.removeBucket(storageBucket.slug)
    } catch (error) {
      logger.error(error, 'Error deleting bucket')
    }
  }

  async uploadFile(
    _organization: Organization,
    _project: Project,
    storageBucket: StorageBucket,
    filePath: string,
    tmpPath: string,
    contentType: string
  ) {
    try {
      const file = await fs.readFile(tmpPath)
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: storageBucket.slug,
          Key: filePath,
          Body: file,
          ContentType: contentType,
        })
      )
    } catch (error) {
      logger.error('Error uploading file to bucket', error)
    }
  }

  async downloadFile(
    _organization: Organization,
    _project: Project,
    storageBucket: StorageBucket,
    filename: any
  ) {
    try {
      const command = new GetObjectCommand({
        Bucket: storageBucket.slug,
        Key: filename,
      })
      const response = await this.s3Client.send(command)

      return {
        file: await response.Body!.transformToString(),
        contentType: response.ContentType!,
      }
    } catch (error) {
      logger.error('Error downloading file', error)
      return {
        file: '',
        contentType: '',
      }
    }
  }

  async deleteFile(
    _organization: Organization,
    _project: Project,
    bucket: StorageBucket,
    filename: string
  ) {
    try {
      await this.s3Client.send(new DeleteObjectCommand({ Bucket: bucket.slug, Key: filename }))
    } catch (error) {
      logger.error('Error deleting file from bucket', error)
    }
  }
}
