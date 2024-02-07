import Button from '@/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import type { Project } from '@/concerns/projects/types/project'
import { IconBrandGithub } from '@tabler/icons-react'
import React from 'react'
import useGitHubRepositories from '../../hooks/use_github_repositories'
import type { Application } from '../../types/application'
import ConnectGithubRepositoryListItem from './connect_github_repository_list_item'
import clsx from 'clsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import Spinner from '@/components/spinner'

export type ConnectGithubRepositoryProps = {
  project: Project
  application: Application
}

export default function ConnectGithubRepository({
  project,
  application,
}: ConnectGithubRepositoryProps) {
  const { owners, githubLoading, ownersList, selectedOwner, setSelectedOwner, repos } =
    useGitHubRepositories()

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" className="space-x-2">
          <IconBrandGithub stroke={2} size={18} />
          <span>Connect a GitHub repository</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={clsx('sm:max-w-[425px] gap-0', githubLoading && 'pb-2')}>
        <DialogHeader>
          <DialogTitle className="items-center space-x-2">Connect a GitHub repository</DialogTitle>
        </DialogHeader>

        <div>
          <div className={clsx('px-6 py-4', selectedOwner && 'border-b border-accent')}>
            <a
              className="text-blue-700 hover:text-blue-500 transition-colors text-sm cursor-pointer"
              onClick={() => {
                window.open(
                  'https://github.com/apps/software-citadel/installations/new',
                  'popup',
                  'width=600,height=600'
                )
                return false
              }}
            >
              Install or configure GitHub app
            </a>
          </div>

          {selectedOwner && (
            <>
              <div className="px-6 py-4">
                <Select
                  defaultValue={selectedOwner.name}
                  onValueChange={(project) => {
                    setSelectedOwner(owners[project])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownersList.map((owner) => (
                      <SelectItem value={owner.name} key={owner.name} className="cursor-pointer">
                        <img
                          className="h-6 w-6 rounded-full shadow-lg"
                          src={owner.imageUrl}
                          alt={owner.name}
                        />
                        <span>{owner.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[50vh] px-6 border-t border-accent">
                <ul className="divide-y divide-accent">
                  {repos.map((repository) => (
                    <ConnectGithubRepositoryListItem
                      key={repository.name}
                      project={project}
                      application={application}
                      repository={repository}
                      selectedOwner={selectedOwner}
                    />
                  ))}
                </ul>
              </div>
            </>
          )}

          {githubLoading && (
            <div className="py-4 pt-6 px-6 border-t border-accent">
              <Spinner className="mr-2 h-4 w-4 animate-spin text-blue-700" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
