import * as React from 'react'
import SharedLayout from './shared_layout'
import ProjectSelector from '@/concerns/projects/components/project_selector'
import useProjects from '@/concerns/projects/hooks/use_projects'
import { Link } from '@inertiajs/react'
import { IconArrowBackUp } from '@tabler/icons-react'
import useProjectLayoutNavigationItems from '@/concerns/projects/hooks/use_project_layout_navigation_items'

interface ProjectLayoutProps extends React.PropsWithChildren {}

const ProjectLayout: React.FunctionComponent<ProjectLayoutProps> = ({ children }) => {
  const projects = useProjects()
  const currentProjectId = window.location.pathname.split('/')[2]
  const currentProject = projects.find((project) => project.id === parseInt(currentProjectId))
  const navigationItems = useProjectLayoutNavigationItems(currentProject)

  return (
    <SharedLayout
      children={children}
      sidebarHeaderChildren={
        <ProjectSelector projects={projects} currentProjectId={currentProjectId} />
      }
      sidebarFooterChildren={
        <Link
          className="text-sm flex items-center text-zinc-900 hover:opacity-50 transition space-x-2"
          href="/projects"
        >
          <IconArrowBackUp size={20} stroke={1} />
          <span>Back to projects</span>
        </Link>
      }
      navigationItems={navigationItems}
    />
  )
}

export default ProjectLayout
