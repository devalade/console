import { usePage } from '@inertiajs/react'
import { IconLayoutGrid, IconSettings, type TablerIconsProps } from '@tabler/icons-react'
import type { Project } from '../types/project'

export default function useProjectLayoutNavigationItems(project: Project): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  return [
    {
      name: 'Applications',
      href: `/projects/${project.slug}/applications`,
      icon: IconLayoutGrid,
      current: page.url === `/projects/${project.slug}/applications`,
    },
    {
      name: 'Project Settings',
      href: `/projects/${project.slug}/edit`,
      icon: IconSettings,
      current: page.url === `/projects/${project.slug}/edit`,
    },
  ]
}
