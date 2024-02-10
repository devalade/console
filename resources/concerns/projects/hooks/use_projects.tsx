import usePageProps from '@/hooks/use_page_props'
import type { Project } from '../types/project'

export default function useProjects() {
  const props = usePageProps<{
    projects: Array<Project>
  }>()

  return props.projects
}
