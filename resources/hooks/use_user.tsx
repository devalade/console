import usePageProps from './use_page_props'

export default function useUser() {
  const props = usePageProps<{
    user: { id: number; fullName: string; email: string }
  }>()

  return props.user
}
