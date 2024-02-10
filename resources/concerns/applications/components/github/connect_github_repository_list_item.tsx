import Button from '@/components/button'
import type { Project } from '@/concerns/projects/types/project'
import { useForm } from '@inertiajs/react'
import { IconGitBranch, IconLock } from '@tabler/icons-react'
import React from 'react'
import type { Application } from '../../types/application'
import type { GithubRepository, GithubRepositoryOwner } from '#types/github_repository'
import useParams from '@/hooks/use_params'

export type ConnectGithubRepositoryListItemProps = {
  project: Project
  application: Application
  repository: GithubRepository
  selectedOwner: GithubRepositoryOwner
}

export default function ConnectGithubRepositoryListItem({
  project,
  application,
  repository,
  selectedOwner,
}: ConnectGithubRepositoryListItemProps) {
  const params = useParams()
  const form = useForm({
    githubRepository: `${selectedOwner.name}/${repository.name}`,
    githubInstallationId: selectedOwner.installationId,
    githubBranch: repository.defaultBranch,
  })
  const onConnect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.put(
      `/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}`
    )
  }
  return (
    <li className="flex justify-between py-4" key={repository.name}>
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <a
            className="flex space-x-2 items-center hover:opacity-75 transition-opacity"
            href={`https://www.github.com/${selectedOwner.name}/${repository.name}`}
            target="_blank"
          >
            <span className="text-sm text-zinc-900 font-semibold">{repository.name}</span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <IconGitBranch className="w-4 h-4" />
          <span className="text-sm">{repository.defaultBranch}</span>
        </div>
      </div>
      <form className="flex space-x-2 items-center" onSubmit={onConnect}>
        {repository.isPrivate && (
          <div className="text-blue-600">
            <IconLock size={16} />
          </div>
        )}

        <Button className="!px-2 !py-1" variant="outline" type="submit" loading={form.processing}>
          Connect
        </Button>
      </form>
    </li>
  )
}
