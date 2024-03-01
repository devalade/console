import type { Project } from '@/concerns/projects/types/project'
import React from 'react'
import type { Application } from '../types/application'
import useParams from '@/hooks/use_params'
import Tab from '@/components/tab'

export type ApplicationTabsProps = {
  project: Project
  application: Application
}

export default function ApplicationTabs({ project, application }: ApplicationTabsProps) {
  const params = useParams()
  const tabHrefPrefix = `/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}`

  const applicationTabs = [
    {
      label: 'Overview',
      href: tabHrefPrefix,
    },
    {
      label: 'Logs',
      href: `${tabHrefPrefix}/logs`,
    },
    {
      label: 'Deployments',
      href: `${tabHrefPrefix}/deployments`,
    },
    {
      label: 'Environment variables',
      href: `${tabHrefPrefix}/env`,
    },
    {
      label: 'Certificates',
      href: `${tabHrefPrefix}/certificates`,
    },
    {
      label: 'Settings',
      href: `${tabHrefPrefix}/edit`,
    },
  ]

  return (
    <nav className="flex overflow-x-auto border-b border-zinc-200 bg-white py-4 px-12">
      <ul className="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-600">
        {applicationTabs.map((item) => (
          <Tab key={item.label} {...item} />
        ))}
      </ul>
    </nav>
  )
}
