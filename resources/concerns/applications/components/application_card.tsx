import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Application } from '../types/application'
import { Link } from '@inertiajs/react'
import { Card, CardContent, CardTitle } from '@/components/card'
import { IconTerminal2 } from '@tabler/icons-react'

interface ApplicationCardProps {
  project: Project
  application: Application
}

const ApplicationCard: React.FunctionComponent<ApplicationCardProps> = ({
  project,
  application,
}) => {
  return (
    <Link
      className="hover:opacity-75 transition-opacity"
      href={`/projects/${project.id}/applications/${application.id}`}
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
