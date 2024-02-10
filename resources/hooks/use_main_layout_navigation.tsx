import { usePage } from '@inertiajs/react'
import { IconLayoutGrid, IconSettings, type TablerIconsProps } from '@tabler/icons-react'
import useParams from './use_params'
import useOrganizations from '@/concerns/organizations/hooks/use_organizations'

export default function useMainLayoutNavigation(): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  const { currentOrganization } = useOrganizations()
  return [
    {
      name: 'Projects',
      href: `/organizations/${currentOrganization.slug}/projects`,
      icon: IconLayoutGrid,
      current: page.url === `/organizations/${currentOrganization.slug}/projects`,
    },
    {
      name: 'Organization Settings',
      href: `/organizations/${currentOrganization.slug}/edit`,
      icon: IconSettings,
      current: page.url === `/organizations/${currentOrganization.slug}/edit`,
    },
  ]
}
