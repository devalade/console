import usePageProps from '@/hooks/use_page_props'
import type { Project } from '../types/project'

export default function useCurrentProject() {
  const props = usePageProps<{
    project: Project
  }>()

  return props.project
}
