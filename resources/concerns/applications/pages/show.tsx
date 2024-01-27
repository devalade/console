import * as React from 'react'
import ApplicationLayout from '../application_layout'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'

interface ShowProps {
  project: Project
  application: Application
}

const Show: React.FunctionComponent<ShowProps> = ({ project, application }) => {
  return <ApplicationLayout project={project} application={application}></ApplicationLayout>
}

export default Show
