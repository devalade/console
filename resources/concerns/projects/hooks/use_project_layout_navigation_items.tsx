import { usePage } from '@inertiajs/react'
import { IconLayoutGrid, IconSettings, type TablerIconsProps } from '@tabler/icons-react'

export default function useProjectLayoutNavigationItems(project: {
  id: number
  name: string
}): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  return [
    {
      name: 'Applications',
      href: `/projects/${project.id}/applications`,
      icon: IconLayoutGrid,
      current: page.url === `/projects/${project.id}/applications`,
    },
    {
      name: 'Projects Settings',
      href: `/projects/${project.id}/edit`,
      icon: IconSettings,
      current: page.url === `/projects/${project.id}/edit`,
    },
  ]
}
