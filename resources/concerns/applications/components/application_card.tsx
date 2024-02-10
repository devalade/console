import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Application } from '../types/application'
import { Link } from '@inertiajs/react'
import { Card, CardContent, CardTitle } from '@/components/card'
import { IconTerminal2 } from '@tabler/icons-react'
import useParams from '@/hooks/use_params'

interface ApplicationCardProps {
  project: Project
  application: Application
}

const ApplicationCard: React.FunctionComponent<ApplicationCardProps> = ({
  project,
  application,
}) => {
  const params = useParams()
  return (
    <Link
      className="hover:opacity-75 transition-opacity"
      href={`/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}`}
    >
      <Card>
        <CardContent>
          <CardTitle className="!text-lg">{application.name}</CardTitle>

          <IconTerminal2 className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}

export default ApplicationCard
