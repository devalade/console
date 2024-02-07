import { useEffect, useState } from 'react'
import { stardust } from '@eidellev/adonis-stardust/client'
import {
  GithubRepositoriesRecord,
  GithubRepository,
  GithubRepositoryOwner,
  GithubRepositoryOwnersRecord,
} from 'App/Types/GithubRepository'

export default function useGitHubRepositories() {
  const [owners, setOwners] = useState<GithubRepositoryOwnersRecord | null>(null)
  const [ownersList, setOwnersList] = useState<GithubRepositoryOwner[]>([])
  const [selectedOwner, setSelectedOwner] = useState<GithubRepositoryOwner | null>(null)
  const [repositories, setRepositories] = useState<GithubRepositoriesRecord[]>([])
  const [repos, setRepos] = useState<GithubRepository[]>([])
  const [githubLoading, setGithubLoading] = useState<boolean>(false)
  useEffect(() => {
    async function loadRepositories() {
      setGithubLoading(true)
      const url = stardust.route('application.github.listRepositories')
      const response = await fetch(url)
      const data = await response.json()
      const ownersList = Object.values(data.owners).sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      ) as GithubRepositoryOwner[]
      const firstOwner: any = ownersList[0]
      setOwners(data.owners)
      setOwnersList(ownersList)
      setSelectedOwner(firstOwner)
      setRepositories(data.repos)
      if (firstOwner) {
        setRepos(data.repos[firstOwner?.name].repositories)
      }
      setGithubLoading(false)
    }

    function listenForUpdates() {
      const url = stardust.route('github.streamRepositoriesListUpdate')
      const eventSource = new EventSource(url)
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if ('loading' in data) {
            setGithubLoading(data.loading)
            return
          }
        } catch {}

        try {
          const { repos, owners } = JSON.parse(event.data) as {
            repos: GithubRepositoriesRecord[]
            owners: GithubRepositoryOwnersRecord
          }
          const ownersList = Object.values(owners).sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          ) as GithubRepositoryOwner[]
          setRepositories(repos)
          setOwners(owners)
          setOwnersList(ownersList)
          if (!ownersList.find((owner) => owner.name === selectedOwner?.name)) {
            setSelectedOwner(ownersList[0])
          }
        } catch {}
      }
    }

    loadRepositories()

    listenForUpdates()
  }, [])

  useEffect(() => {
    if (selectedOwner) {
      setRepos(repositories[selectedOwner.name]?.repositories || [])
    }
  }, [selectedOwner, repositories])

  return {
    owners,
    ownersList,
    setOwners,
    selectedOwner,
    setSelectedOwner,
    repositories,
    setRepositories,
    repos,
    githubLoading,
  }
}
