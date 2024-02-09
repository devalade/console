import usePageProps from '@/hooks/use_page_props'

export default function useOrganizations() {
  const props = usePageProps<{
    user: { defaultOrganizationId: number }
    organizations: { name: string; slug: string; id: number }[]
    params: { organizationSlug?: string }
  }>()

  /**
   * Get the current organization, based on the URL or the user's default organization.
   */
  let currentOrganization: { name: string; slug: string; id: number }
  if (props.params.organizationSlug) {
    currentOrganization = props.organizations.find(
      (organization) => organization.slug === props.params.organizationSlug
    )
  } else {
    currentOrganization = props.organizations.find(
      (organization) => organization.id === props.user.defaultOrganizationId
    )
  }

  return { organizations: props.organizations, currentOrganization }
}
