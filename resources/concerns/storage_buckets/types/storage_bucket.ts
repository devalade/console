export type StorageBucket = {
  id: number
  name: string
  slug: string
  host: string
  keyId: string
  secretKey: string
}

export type StorageBucketFile = {
  size: number
  filename: string
  updatedAt: Date
  type: string
}
