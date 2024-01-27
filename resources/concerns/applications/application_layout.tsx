import * as React from 'react'
import type { Application } from './types/application'
import type { Project } from '../projects/types/project'
import ProjectLayout from '@/layouts/project_layout'
import ApplicationTabs from './components/application_tabs'
import ApplicationBreadcrumbs from './components/application_breadcrumbs'

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
      <ApplicationBreadcrumbs project={project} application={application} />
      <ApplicationTabs project={project} application={application} />
      <div className="py-6 bg-zinc-50">{children}</div>
    </ProjectLayout>
  )
}

export default ApplicationLayout
