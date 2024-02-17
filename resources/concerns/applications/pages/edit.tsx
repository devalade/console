import * as React from 'react'
import ApplicationLayout from '../application_layout'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import ApplicationSettingsCard from '../components/application_settings_card'
import DeleteApplicationCard from '../components/delete_application_card'
import ConnectGitHubRepositoryCard from '../components/github/connected_github_repository_card'
import isFeatureEnabled from '@/lib/is_feature_enabled'

interface EditProps {
  project: Project
  application: Application
}

const Edit: React.FunctionComponent<EditProps> = ({ project, application }) => {
  return (
    <ApplicationLayout project={project} application={application}>
      <ApplicationSettingsCard project={project} application={application} />
      {isFeatureEnabled('deployments:github') && (
        <ConnectGitHubRepositoryCard project={project} application={application} />
      )}
      <DeleteApplicationCard project={project} application={application} />
    </ApplicationLayout>
  )
}

export default Edit
