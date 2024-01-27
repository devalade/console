import * as React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/select'
import type { Project } from '../types/project'

interface ProjectSelectorProps {
  currentProjectId: string
  projects: Array<Project>
}

const ProjectSelector: React.FunctionComponent<ProjectSelectorProps> = ({
  currentProjectId,
  projects,
}) => {
  return (
    <Select
      defaultValue={currentProjectId}
      onValueChange={(projectId) => {
        window.location.href = '/projects/' + projectId + '/edit'
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {projects?.map((project) => (
          <SelectItem
            value={project.id.toString()}
            key={project.id.toString()}
            className="cursor-pointer"
          >
            <span>{project.name}</span>
            {project.name !== project.id.toString() && (
              <span className="text-zinc-400">({project.id.toString()})</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ProjectSelector
