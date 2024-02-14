import type { Project } from '@/concerns/projects/types/project'
import useParams from '@/hooks/use_params'
import React from 'react'
import type { Board } from '../types/board'
import { Link } from '@inertiajs/react'

export type KanbanBoardTabsProps = {
  project: Project
  board: Board
}

export default function KanbanBoardTabs({ project, board }: KanbanBoardTabsProps) {
  const params = useParams()
  const applicationTabs = [
    {
      label: 'Board',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}`,
    },
    {
      label: 'Settings',
      href: `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}/edit`,
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
