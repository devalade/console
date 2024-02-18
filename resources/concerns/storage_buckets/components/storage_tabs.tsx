import type { Project } from '@/concerns/projects/types/project'
import { Link } from '@inertiajs/react'
import React from 'react'
import type { StorageBucket } from '../types/storage_bucket'
import useParams from '@/hooks/use_params'

export type StorageTabsProps = {
  project: Project
  storageBucket: StorageBucket
}

export default function StorageTabs({ project, storageBucket }: StorageTabsProps) {
  const params = useParams()
  const applicationTabs = [
    {
      label: 'Overview',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}`,
    },
    {
      label: 'Settings',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/edit`,
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
                item.href === window.location.pathname ? 'text-blue-600' : 'hover:text-blue-600'
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
