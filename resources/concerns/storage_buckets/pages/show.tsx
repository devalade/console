import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { StorageBucket } from '../types/storage_bucket'
import StorageBucketInfo from '../components/storage_bucket_info'
import StorageLayout from '../storage_layout'
import StorageBucketBrowser from '../components/storage_bucket_browser'
import type { StorageBucketFile } from '~/types/storage'

export type ShowProps = {
  project: Project
  storageBucket: StorageBucket
  files: StorageBucketFile[]
  bucketSize: number
}

export default function Show({ project, storageBucket, bucketSize, files }: ShowProps) {
  return (
    <StorageLayout>
      <StorageBucketInfo storageBucket={storageBucket} size={bucketSize} />
      <StorageBucketBrowser storageBucket={storageBucket} files={files} project={project} />
    </StorageLayout>
  )
}
