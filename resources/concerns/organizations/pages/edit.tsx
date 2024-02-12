import * as React from 'react'
import MainLayout from '@/layouts/main_layout'
import EditOrganizationCard from '../components/edit_organization_card'
import DestroyOrganizationCard from '../components/destroy_organization_card'
import MembersManagementCard from '../components/members_management_card'

interface EditProps {
  organization: { name: string; slug: string }
}

const Edit: React.FunctionComponent<EditProps> = ({ organization }) => {
  return (
    <MainLayout>
      <h1 className="font-clash font-semibold text-3xl">Organization Settings</h1>

      <EditOrganizationCard organization={organization} />
      <MembersManagementCard organization={organization} />
      <DestroyOrganizationCard organization={organization} />
    </MainLayout>
  )
}

export default Edit
