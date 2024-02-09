import usePageProps from '@/hooks/use_page_props'

export default function useOrganizations() {
  const props = usePageProps<{
    user: { defaultOrganizationId: number }
    organizations: { name: string; slug: string; id: number }[]
    params: { organizationSlug: string }
  }>()

  /**
   * Get the current organization, based on the URL's organization slug.
   */
  const currentOrganization: { name: string; slug: string; id: number } = props.organizations.find(
    (organization) => organization.slug === props.params.organizationSlug
  )

  return { organizations: props.organizations, currentOrganization }
}
