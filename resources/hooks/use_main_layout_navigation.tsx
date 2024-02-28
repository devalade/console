import { usePage } from '@inertiajs/react'
import {
  IconLayoutGrid,
  IconMessageCircle,
  IconSettings,
  type TablerIconsProps,
} from '@tabler/icons-react'
import useOrganizations from '@/concerns/organizations/hooks/use_organizations'
import isFeatureEnabled from '@/lib/is_feature_enabled'

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
    isFeatureEnabled('chat') && {
      name: 'Chat',
      href: `/organizations/${currentOrganization.slug}/chat`,
      icon: IconMessageCircle,
      current: page.url.startsWith(`/organizations/${currentOrganization.slug}/chat`),
    },
    {
      name: 'Organization Settings',
      href: `/organizations/${currentOrganization.slug}/edit`,
      icon: IconSettings,
      current: page.url === `/organizations/${currentOrganization.slug}/edit`,
    },
  ].filter(Boolean)
}
