import * as React from 'react'
import useGitHubRepositories from '../hooks/use_github_repositories'
import Button from '@/components/button'
import { useForm } from '@inertiajs/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import Spinner from '@/components/spinner'
import { IconBrandGithub, IconGitBranch, IconLock } from '@tabler/icons-react'

interface CreateApplicationDialogGithubStepProps {
  form: ReturnType<
    typeof useForm<{
      githubRepository: string
      githubBranch: string
      githubInstallationId: number
    }>
  >
}

const CreateApplicationDialogGithubStep: React.FunctionComponent<
  CreateApplicationDialogGithubStepProps
> = ({ form }) => {
  const { owners, githubLoading, ownersList, selectedOwner, setSelectedOwner, repos } =
    useGitHubRepositories()
  return (
    <div>
      <div className="border-b border-accent px-6 pb-4">
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
          Install Or Configure GitHub App
        </a>
      </div>

      {selectedOwner && !form.data.githubRepository && (
        <>
          <div className="px-6 py-4">
            <Select
              defaultValue={selectedOwner.name}
              onValueChange={(ownerIdx) => setSelectedOwner(owners[ownerIdx])}
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
                <li className="flex justify-between py-4" key={repository.name}>
                  <div className="flex flex-col space-y-2">
                    <div className="flex">
                      <a
                        className="flex space-x-2 items-center hover:opacity-75 transition-opacity"
                        href={`https://www.github.com/${selectedOwner.name}/${repository.name}`}
                        target="_blank"
                      >
                        <span className="text-sm text-zinc-900 font-semibold">
                          {repository.name}
                        </span>
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
                  <div className="flex space-x-2 items-center">
                    {repository.isPrivate && (
                      <div className="text-blue-600">
                        <IconLock size={16} />
                      </div>
                    )}

                    <Button
                      className="!px-2 !py-1"
                      variant="outline"
                      onClick={() => {
                        form.setData('githubRepository', `${selectedOwner.name}/${repository.name}`)
                        form.setData('githubBranch', repository.defaultBranch)
                        form.setData('githubInstallationId', selectedOwner.installationId)
                      }}
                      type="button"
                    >
                      Connect
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {githubLoading && (
        <div className="py-4 px-6 border-b border-accent">
          <Spinner className="mr-2 h-4 w-4 animate-spin text-blue-700" />
        </div>
      )}

      {form.data.githubRepository && (
        <div className="flex justify-between items-center py-4 px-6">
          <div className="flex flex-col space-y-2">
            <div className="flex">
              <a
                className="flex space-x-2 items-center hover:opacity-75 transition-opacity"
                href={`https://www.github.com/${form.data.githubRepository}`}
                target="_blank"
              >
                <div className="flex items-center space-x-2 text-blue-600">
                  <IconBrandGithub className="w-4 h-4" />
                </div>
                <span className="text-sm text-zinc-900 font-semibold">
                  {form.data.githubRepository.split('/')[1]}
                </span>
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
          </div>
          <div className="flex space-x-2 items-center">
            <Button
              className="!px-2 !py-1"
              variant="destructive"
              onClick={() => {
                form.setData('githubRepository', '')
                form.setData('githubBranch', '')
              }}
              type="button"
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateApplicationDialogGithubStep
