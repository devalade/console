import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Application } from '../types/application'
import ApplicationLayout from '../application_layout'

interface LogsProps {
  project: Project
  application: Application
}

const Logs: React.FunctionComponent<LogsProps> = ({ project, application }) => {
  return <ApplicationLayout project={project} application={application} />
}

export default Logs
