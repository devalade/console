import type { Project } from '@/concerns/projects/types/project'
import { Link } from '@inertiajs/react'
import React from 'react'
import type { Application } from '../types/application'

export type ApplicationTabsProps = {
  project: Project
  application: Application
}

export default function ApplicationTabs({ project, application }: ApplicationTabsProps) {
  const applicationTabs = [
    {
      label: 'Overview',
      href: `/projects/${project.slug}/applications/${application.slug}`,
      isActive:
        window.location.pathname === `/projects/${project.slug}/applications/${application.slug}`,
    },
    {
      label: 'Settings',
      href: `/projects/${project.slug}/applications/${application.slug}/edit`,
      isActive:
        window.location.pathname ===
        `/projects/${project.slug}/applications/${application.slug}/edit`,
    },
  ]

  return (
    <nav className="flex overflow-x-auto border-b border-zinc-200 bg-white py-4 px-12">
      <ul className="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-600">
        {applicationTabs.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={`${
                item.isActive ? 'text-blue-600' : 'hover:text-blue-600'
              } whitespace-nowrap`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
