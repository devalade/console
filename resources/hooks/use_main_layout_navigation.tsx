import { usePage } from '@inertiajs/react'
import { IconLayoutGrid, IconSettings, type TablerIconsProps } from '@tabler/icons-react'

export default function useMainLayoutNavigation(): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  return [
    {
      name: 'Projects',
      href: '/projects',
      icon: IconLayoutGrid,
      current: page.url === '/projects',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: IconSettings,
      current: page.url === '/settings',
    },
  ]
}
