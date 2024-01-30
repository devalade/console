import usePageProps from './use_page_props'

export default function useUser() {
  const props = usePageProps<{
    user: { fullName: string; email: string }
  }>()

  return props.user
}
