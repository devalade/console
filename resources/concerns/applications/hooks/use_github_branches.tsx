import { useEffect, useState } from 'react'
import type { Application } from '../types/application'

export default function useGitHubBranches(application: Application) {
  const [branchesLoading, setGithubLoading] = useState<boolean>(false)
  const [branches, setBranches] = useState<string[]>([])

  useEffect(() => {
    async function loadRepositories() {
      setGithubLoading(true)
      const response = await fetch(`/api/github/${application.slug}/branches`)
      const data = await response.json()
      setBranches(data.branches)
      setGithubLoading(false)
    }
    loadRepositories()
  }, [application])

  return {
    branches,
    branchesLoading,
  }
}
