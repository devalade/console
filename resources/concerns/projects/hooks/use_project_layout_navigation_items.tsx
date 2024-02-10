import { usePage } from '@inertiajs/react'
import {
  Icon3dCubeSphere,
  IconDatabase,
  IconSettings,
  type TablerIconsProps,
} from '@tabler/icons-react'
import type { Project } from '../types/project'
import useParams from '@/hooks/use_params'

export default function useProjectLayoutNavigationItems(project: Project): Array<{
  name: string
  href: string
  icon: (props: TablerIconsProps) => JSX.Element
  current: boolean
}> {
  const page = usePage()
  const params = useParams()
  return [
    {
      name: 'Applications',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/applications`,
      icon: Icon3dCubeSphere,
      current:
        page.url ===
        `/organizations/${params.organizationSlug}/projects/${project.slug}/applications`,
    },
    {
      name: 'Databases',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/databases`,
      icon: IconDatabase,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/databases`,
    },
    {
      name: 'Project Settings',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/edit`,
      icon: IconSettings,
      current:
        page.url === `/organizations/${params.organizationSlug}/projects/${project.slug}/edit`,
    },
  ]
}
