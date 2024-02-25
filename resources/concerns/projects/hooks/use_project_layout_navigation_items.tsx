import { usePage } from '@inertiajs/react'
import {
  Icon3dCubeSphere,
  IconArchive,
  IconBrandGit,
  IconDatabase,
  IconFunction,
  IconLayoutKanban,
  IconMailFast,
  IconReportAnalytics,
  IconServer,
  IconSettings,
  type TablerIconsProps,
} from '@tabler/icons-react'
import type { Project } from '../types/project'
import useParams from '@/hooks/use_params'
import isFeatureEnabled from '@/lib/is_feature_enabled'

export default function useProjectLayoutNavigationItems(project: Project): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  const params = useParams()
  const items = [
    {
      name: 'Applications',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/applications`,
      icon: Icon3dCubeSphere,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/applications`,
    },
    {
      name: 'Analytics',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/analytics_websites`,
      icon: IconReportAnalytics,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/analytics_websites`,
      comingSoon: true,
    },
    {
      name: 'Git',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/git_repositories`,
      icon: IconBrandGit,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/git_repositories`,
      comingSoon: true,
    },
    {
      name: 'Databases',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/databases`,
      icon: IconDatabase,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/databases`,
    },
    {
      name: 'Dev Machines',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/dev-machines`,
      icon: IconServer,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/dev-machines`,
      comingSoon: true,
    },
    {
      name: 'Functions',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/functions`,
      icon: IconFunction,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/functions`,
      comingSoon: true,
    },
    isFeatureEnabled('storage_buckets') && {
      name: 'Storage Buckets',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets`,
      icon: IconArchive,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets`,
    },
    isFeatureEnabled('kanban') && {
      name: 'Task Boards',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards`,
      icon: IconLayoutKanban,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards`,
    },
    {
      name: 'Mails',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/mails`,
      icon: IconMailFast,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/mails`,
      comingSoon: true,
    },
  ].filter(Boolean)

  const comingSoon = items.filter((item) => item.comingSoon)
  const notComingSoon = items.filter((item) => !item.comingSoon)
  return [
    ...notComingSoon,
    ...comingSoon,
    {
      name: 'Project Settings',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/edit`,
      icon: IconSettings,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/edit`,
    },
  ]
}
