import * as React from 'react'
import ApplicationLayout from '../application_layout'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { usePage } from '@inertiajs/react'

interface ShowProps {
  project: Project
  application: Application
  wildcardDomain: string
}

const Show: React.FunctionComponent<ShowProps> = ({ project, application, wildcardDomain }) => {
  return (
    <ApplicationLayout project={project} application={application}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Application Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-semibold text-zinc-900">Link to your application</dt>
              <dd className="mt-1 text-sm text-blue-100">
                <a
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  href={'https://' + application.hostname}
                  target="_blank"
                >
                  {application.hostname}
                </a>
              </dd>
            </div>

            {application.cpu && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-semibold text-zinc-900">CPU Configuration</dt>
                <dd className="mt-1 text-sm text-zinc-700">{application.cpu}</dd>
              </div>
            )}

            {application.ram && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-semibold text-zinc-900">RAM Configuration</dt>
                <dd className="mt-1 text-sm text-zinc-700">{application.ram}</dd>
              </div>
            )}

            {application.sharedIpv4 && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-semibold text-zinc-900">Shared IPV4</dt>
                <dd className="mt-1 text-sm text-zinc-700">{application.sharedIpv4}</dd>
              </div>
            )}

            {application.ipv6 && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-semibold text-zinc-900">Dedicated IPV6</dt>
                <dd className="mt-1 text-sm text-zinc-700">{application.ipv6}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

export default Show
