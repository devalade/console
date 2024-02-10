import * as React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import useOrganizations from '../hooks/use_organizations'
import { IconPlus, IconUsers } from '@tabler/icons-react'
import CreateOrganizationDialog from './create_organization_dialog'

interface OrganizationsSelectorProps {}

const OrganizationsSelector: React.FunctionComponent<OrganizationsSelectorProps> = () => {
  const { organizations, currentOrganization } = useOrganizations()
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)

  return (
    <>
      <CreateOrganizationDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />

      <Select
        defaultValue={currentOrganization.slug}
        onValueChange={(value) => {
          if (value === 'create') {
            setCreateDialogOpen(true)
            return
          }
          window.location.href = `/organizations/${value}/projects`
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>

        <SelectContent>
          {organizations.map((organization) => (
            <SelectItem
              value={organization.slug}
              key={organization.slug}
              className="cursor-pointer"
            >
              <IconUsers className="h-4 w-4 rounded-full shadow-lg mr-1" />
              <span className="pr-2">{organization.name}</span>
            </SelectItem>
          ))}
          <SelectItem value="create" className="cursor-pointer">
            <IconPlus className="h-4 w-4 rounded-full shadow-lg mr-1" />
            <span>Create New Organization</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

export default OrganizationsSelector
