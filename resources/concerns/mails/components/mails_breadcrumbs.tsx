import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import { Icon3dCubeSphere } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import usePageProps from '@/hooks/use_page_props'

interface MailsBreadcrumbsProps {}

const MailsBreadcrumbs: React.FunctionComponent<MailsBreadcrumbsProps> = ({}) => {
  const params = useParams()
  const { project } = usePageProps<{ project: Project }>()
  return (
    <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 py-4 px-12 bg-white sm:flex-row sm:items-center border-b border-zinc-200">
      <div className="flex items-center gap-x-3">
        <h1 className="flex gap-x-3 text-base leading-7 items-center">
          <Link
            className="hover:opacity-75 transition"
            href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/applications`}
          >
            <Icon3dCubeSphere className="w-5 h-5" />
          </Link>
          <span className="!text-zinc-600">/</span>

          <div className="flex gap-x-2">
            <span className="font-semibold text-zinc-900">{project.name}</span>
          </div>
          <span className="!text-zinc-600">/</span>
          <div className="flex gap-x-2">
            <span className="font-semibold text-zinc-900">Mails</span>
          </div>
        </h1>
      </div>
    </div>
  )
}

export default MailsBreadcrumbs
