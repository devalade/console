import * as React from 'react'
import SharedLayout from './shared_layout'
import ProjectSelector from '@/concerns/projects/components/project_selector'
import useProjects from '@/concerns/projects/hooks/use_projects'
import { Link } from '@inertiajs/react'
import { IconArrowBackUp } from '@tabler/icons-react'
import useProjectLayoutNavigationItems from '@/concerns/projects/hooks/use_project_layout_navigation_items'
import useCurrentProject from '@/concerns/projects/hooks/use_current_project'
import useParams from '@/hooks/use_params'
import { PresenceProvider } from '@/presence_context'

interface ProjectLayoutProps extends React.PropsWithChildren {
  className?: string
}

const ProjectLayout: React.FunctionComponent<ProjectLayoutProps> = ({ children, className }) => {
  const projects = useProjects()
  const params = useParams()
  const currentProject = useCurrentProject()
  const navigationItems = useProjectLayoutNavigationItems(currentProject)

  return (
    <PresenceProvider>
      <SharedLayout
        children={children}
        className={className}
        sidebarHeaderChildren={
          <ProjectSelector projects={projects} currentProjectSlug={params.projectSlug} />
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
    </PresenceProvider>
  )
}

export default ProjectLayout
