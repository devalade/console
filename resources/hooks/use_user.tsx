import usePageProps from './use_page_props'

export default function useUser() {
  const props = usePageProps<{
    user: { full_name: string; email: string }
  }>()

  return props.user
}
