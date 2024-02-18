import * as React from 'react'
import StorageLayout from '../storage_layout'
import DeleteStorageBucketCard from '../components/delete_storage_bucket_card'
import EditStorageBucketCard from '../components/edit_storage_bucket_card'
import type { StorageBucket } from '../types/storage_bucket'
import type { Project } from '@/concerns/projects/types/project'

interface EditProps {
  project: Project
  storageBucket: StorageBucket
}

const Edit: React.FunctionComponent<EditProps> = ({ storageBucket, project }) => {
  return (
    <StorageLayout>
      <EditStorageBucketCard storageBucket={storageBucket} project={project} />
      <DeleteStorageBucketCard />
    </StorageLayout>
  )
}

export default Edit
