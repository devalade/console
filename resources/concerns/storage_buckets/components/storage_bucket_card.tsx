import * as React from 'react'
import { IconArchive } from '@tabler/icons-react'
import { Card, CardContent, CardTitle } from '@/components/card'
import type { Project } from '@/concerns/projects/types/project'
import { Link } from '@inertiajs/react'
import type { StorageBucket } from '../types/storage_bucket'
import useParams from '@/hooks/use_params'

interface StorageBucketCardProps {
  project: Project
  storageBucket: StorageBucket
}

const StorageBucketCard: React.FunctionComponent<StorageBucketCardProps> = ({
  project,
  storageBucket,
}) => {
  const params = useParams()
  return (
    <Link
      href={`/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}`}
    >
      <Card className="hover:opacity-75 transition">
        <CardContent>
          <CardTitle className="!text-lg flex items-center space-x-2 font-semibold">
            <span>{storageBucket.name}</span>
          </CardTitle>
          <IconArchive className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}

export default StorageBucketCard
