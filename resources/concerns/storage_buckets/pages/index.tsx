import type { Project } from '@/concerns/projects/types/project'
import React from 'react'
import type { StorageBucket } from '../types/storage_bucket'
import ProjectLayout from '@/layouts/project_layout'
import CreateStorageBucketDialog from '../components/create_storage_bucket_dialog'
import Button from '@/components/button'
import StorageBucketCard from '../components/storage_bucket_card'

export type IndexProps = {
  project: Project & { storageBuckets: StorageBucket[] }
}

export default function Index({ project }: IndexProps) {
  const [openDialog, setOpenDialog] = React.useState(false)

  return (
    <ProjectLayout>
      <CreateStorageBucketDialog open={openDialog} setOpen={setOpenDialog} />

      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Storage Buckets</h1>

        <Button onClick={() => setOpenDialog(true)}>Create storage bucket</Button>
      </div>

      <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {project.storageBuckets.map((storageBucket) => (
          <StorageBucketCard key={project.id} project={project} storageBucket={storageBucket} />
        ))}
      </div>
    </ProjectLayout>
  )
}
