import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/card'
import { IconLayoutGrid } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import type { Project } from '../types/project'

export type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      className="hover:opacity-75 transition-opacity"
      href={`/projects/${project.id}/applications`}
    >
      <Card>
        <CardContent>
          <CardTitle className="!text-lg">{project.name}</CardTitle>
          <IconLayoutGrid className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}
