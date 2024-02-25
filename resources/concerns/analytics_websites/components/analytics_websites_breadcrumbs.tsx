import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import { IconLayoutGrid, IconReportAnalytics } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import usePageProps from '@/hooks/use_page_props'
import type { AnalyticsWebsite } from '../types'

interface AnalyticsWebsitesBreadcrumbsProps {}

const AnalyticsWebsitesBreadcrumbs: React.FunctionComponent<
  AnalyticsWebsitesBreadcrumbsProps
> = () => {
  const params = useParams()
  const { project, analyticsWebsite } = usePageProps<{
    project: Project
    analyticsWebsite: AnalyticsWebsite
  }>()
  return (
    <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 py-4 px-12 bg-white sm:flex-row sm:items-center border-b border-zinc-200">
      <div className="flex items-center gap-x-3">
        <h1 className="flex gap-x-3 text-base leading-7 items-center">
          <Link
            className="hover:opacity-75 transition"
            href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/applications`}
          >
            <IconLayoutGrid className="w-5 h-5" />
          </Link>
          <span className="!text-zinc-600">/</span>
          <span className="font-semibold text-zinc-900">{project.name}</span>
          <span className="!text-zinc-600">/</span>
          <Link
            className="hover:opacity-75 transition"
            href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/analytics_websites`}
          >
            <IconReportAnalytics className="w-5 h-5" />
          </Link>
          <span className="!text-zinc-600">/</span>
          <span className="font-semibold text-zinc-900">{analyticsWebsite.domain}</span>
        </h1>
      </div>
    </div>
  )
}

export default AnalyticsWebsitesBreadcrumbs
