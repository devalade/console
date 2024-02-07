import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import Application from '#models/application'
import env from '#start/env'

export default class CodeArchiveUploaderService {
  async upload(application: Application, fileToUpload: Buffer) {
    const s3Client = new S3Client({
      endpoint: env.get('S3_ENDPOINT'),
      region: env.get('S3_REGION'),
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_SECRET_KEY'),
      },
    })

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.get('S3_BUCKET'),
        Key: `${application.slug}.tar.gz`,
        Body: fileToUpload,
      })
    )
  }
}
