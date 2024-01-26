import usePageProps from '@/hooks/use_page_props'

export default function useProjects() {
  const props = usePageProps<{
    user: {
      projects: Array<Project>
    }
  }>()

  return props.user.projects
}
