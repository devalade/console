import * as React from 'react'
import ApplicationLayout from '../application_layout'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'

interface ShowProps {
  project: Project
  application: Application
}

const Show: React.FunctionComponent<ShowProps> = ({ project, application }) => {
  return (
    <ApplicationLayout project={project} application={application}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Application Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-zinc-900">Link to your application</dt>
              <dd className="mt-1 text-sm text-blue-100">
                <a
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  href={`https://${application.slug}.softwarecitadel.app`}
                  target="_blank"
                >
                  {application.slug}.softwarecitadel.app
                </a>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

export default Show
