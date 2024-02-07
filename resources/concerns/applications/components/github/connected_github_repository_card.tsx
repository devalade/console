import React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../../types/application'
import { useForm } from '@inertiajs/react'
import useSuccessToast from '@/hooks/use_success_toast'
import useGitHubBranches from '../../hooks/use_github_branches'
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from '@/components/card'
import { IconBrandGithub, IconGitBranch } from '@tabler/icons-react'
import Button from '@/components/button'
import Label from '@/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import ConnectGithubRepository from './connect_github_repository'

export type ConnectGitRepositoryCardProps = {
  project: Project
  application: Application
}

export default function ConnectGitRepositoryCard({
  project,
  application,
}: ConnectGitRepositoryCardProps) {
  const form = useForm({ action: 'DISCONNECT_GITHUB' })
  const {
    data,
    setData,
    put: sendGithubBranchUpdate,
    processing,
  } = useForm({ action: 'UPDATE', githubBranch: application.githubBranch })
  const successToast = useSuccessToast()
  const { branches } = useGitHubBranches(application)
  const disconnectGithubRepository = () => {
    form.put(`/projects/${project.slug}/applications/${application.slug}`, {
      onSuccess: successToast,
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    sendGithubBranchUpdate(`/projects/${project.slug}/applications/${application.slug}`, {
      data,
      onSuccess: successToast,
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-6 mx-10">
        <CardHeader>
          <CardTitle>Connected GitHub Repository</CardTitle>
        </CardHeader>
        {application.githubRepository ? (
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center space-x-4 border border-blue-200/10 rounded">
                <div className="flex space-x-2">
                  <IconBrandGithub stroke={2} size={18} className="text-blue-600" />

                  <a
                    className="flex space-x-2 items-center hover:opacity-75 transition-opacity text-sm font-medium"
                    href={`https://www.github.com/${application.githubRepository}`}
                    target="_blank"
                  >
                    <span>{application.githubRepository}</span>
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={disconnectGithubRepository}
                  loading={form.processing}
                >
                  Disconnect
                </Button>
              </div>
            </div>
            <hr />
            <div>
              <Label className="flex items-center space-x-4 space-y-2 mb-2">
                <IconGitBranch size={18} className="text-blue-600 mr-2" />
                Git Branch
              </Label>
              <Select
                name="githubBranch"
                defaultValue={application.githubBranch}
                onValueChange={(project) => {
                  setData('githubBranch', project)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {(branches.length === 0 ? [application.githubBranch] : branches).map((branch) => (
                    <SelectItem value={branch} key={branch} className="cursor-pointer">
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        ) : null}

        <CardFooter className="border-t-0">
          {application.githubRepository ? (
            <Button loading={processing} type="submit">
              Save changes
            </Button>
          ) : (
            <ConnectGithubRepository project={project} application={application} />
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
