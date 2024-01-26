import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import type { Project } from '../types/project'
import EditProjectCard from '../components/edit_project_card'
import DeleteProjectCard from '../components/delete_project_card'

interface EditProps {
  project: Project
}

const Edit: React.FunctionComponent<EditProps> = ({ project }) => {
  return (
    <ProjectLayout>
      <h1 className="font-clash font-semibold text-3xl">Project Settings</h1>
      <EditProjectCard project={project} />
      <DeleteProjectCard project={project} />
    </ProjectLayout>
  )
}

export default Edit
