import type { Project } from '@/concerns/projects/types/project'
import { Link } from '@inertiajs/react'
import React from 'react'
import type { Application } from '../types/application'
import ApplicationTab from './application_tab'

export type ApplicationTabsProps = {
  project: Project
  application: Application
}

export default function ApplicationTabs({ project, application }: ApplicationTabsProps) {
  const applicationTabs = [
    {
      label: 'Overview',
      href: `/projects/${project.slug}/applications/${application.slug}`,
    },
    {
      label: 'Logs',
      href: `/projects/${project.slug}/applications/${application.slug}/logs`,
    },
    {
      label: 'Deployments',
      href: `/projects/${project.slug}/applications/${application.slug}/deployments`,
    },
    {
      label: 'Environment variables',
      href: `/projects/${project.slug}/applications/${application.slug}/env`,
    },
    {
      label: 'Certificates',
      href: `/projects/${project.slug}/applications/${application.slug}/certificates`,
    },
    {
      label: 'Settings',
      href: `/projects/${project.slug}/applications/${application.slug}/edit`,
    },
  ]

  return (
    <nav className="flex overflow-x-auto border-b border-zinc-200 bg-white py-4 px-12">
      <ul className="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-600">
        {applicationTabs.map((item) => (
          <ApplicationTab key={item.label} {...item} />
        ))}
      </ul>
    </nav>
  )
}
