import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/card'
import { IconLayoutGrid } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import type { Project } from '../types/project'
import useParams from '@/hooks/use_params'

export type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams()
  return (
    <Link
      className="hover:opacity-75 transition-opacity"
      href={`/organizations/${params.organizationSlug}/projects/${project.slug}/applications`}
    >
      <Card>
        <CardContent>
          <CardTitle className="!text-lg">{project.name}</CardTitle>
          <CardDescription>{project.slug}</CardDescription>
          <IconLayoutGrid className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}
