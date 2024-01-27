import * as React from 'react'
import type { Application } from './types/application'
import type { Project } from '../projects/types/project'
import ProjectLayout from '@/layouts/project_layout'
import ApplicationTabs from './components/application_tabs'
import { Icon3dCubeSphere } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'

interface ApplicationLayoutProps extends React.PropsWithChildren {
  project: Project
  application: Application
}

const ApplicationLayout: React.FunctionComponent<ApplicationLayoutProps> = ({
  project,
  application,
  children,
}) => {
  return (
    <ProjectLayout className="!p-0">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 py-4 px-12 bg-white sm:flex-row sm:items-center border-b border-zinc-200">
        <div className="flex items-center gap-x-3">
          <h1 className="flex gap-x-3 text-base leading-7 items-center">
            <Link
              className="hover:opacity-75 transition"
              href={`/projects/${project.id}/applications`}
            >
              <Icon3dCubeSphere className="w-5 h-5" />
            </Link>
            <span className="!text-zinc-600">/</span>

            <div className="flex gap-x-2">
              <span className="font-semibold text-zinc-900">{project.name}</span>
            </div>
            <span className="!text-zinc-600">/</span>
            <div className="flex gap-x-2">
              <span className="font-semibold text-zinc-900">{application.name}</span>
            </div>
          </h1>
        </div>
      </div>

      <ApplicationTabs project={project} application={application} />

      <div className="py-6 bg-zinc-50">{children}</div>
    </ProjectLayout>
  )
}

export default ApplicationLayout
