import * as React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/select'
import type { Project } from '../types/project'

interface ProjectSelectorProps {
  currentProjectSlug: string
  projects: Array<Project>
}

const ProjectSelector: React.FunctionComponent<ProjectSelectorProps> = ({
  currentProjectSlug,
  projects,
}) => {
  return (
    <Select
      defaultValue={currentProjectSlug}
      onValueChange={(projectSlug) => {
        window.location.href = '/projects/' + projectSlug + '/edit'
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {projects?.map((project) => (
          <SelectItem value={project.slug} key={project.slug} className="cursor-pointer">
            <span>{project.name}</span>
            {project.name !== project.slug && (
              <span className="text-zinc-400">({project.slug})</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ProjectSelector
