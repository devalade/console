import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { StorageBucket, StorageBucketFile } from '../types/storage_bucket'
import ProjectLayout from '@/layouts/project_layout'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import { IconArchive } from '@tabler/icons-react'
import StorageTabs from '../components/storage_tabs'
import StorageBucketInfo from '../components/storage_bucket_info'
import StorageLayout from '../storage_layout'

export type ShowProps = {
  project: Project
  storageBucket: StorageBucket
  files: StorageBucketFile[]
  bucketSize: number
}

export default function Show({ project, storageBucket, bucketSize }: ShowProps) {
  const params = useParams()
  return (
    <StorageLayout>
      <StorageBucketInfo storageBucket={storageBucket} size={bucketSize} />

      {/*

      <StorageBucketBrowser storageBucket={storageBucket} files={files} project={project} /> */}
    </StorageLayout>
  )
}
