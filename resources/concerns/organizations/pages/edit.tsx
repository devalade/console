import * as React from 'react'
import MainLayout from '@/layouts/main_layout'
import EditOrganizationCard from '../components/edit_organization_card'
import DestroyOrganizationCard from '../components/destroy_organization_card'
import MembersManagementCard from '../components/members_management_card'
import type { Organization } from '../types/organization'
import QuitOrganizationCard from '../components/quit_organization_card'

interface EditProps {
  organization: Organization
  isOwner: boolean
}

const Edit: React.FunctionComponent<EditProps> = ({ organization, isOwner }) => {
  return (
    <MainLayout>
      <h1 className="font-clash font-semibold text-3xl">Organization Settings</h1>

      {isOwner && <EditOrganizationCard organization={organization} />}
      <MembersManagementCard organization={organization} isOwner={isOwner} />
      {isOwner && <DestroyOrganizationCard organization={organization} />}
      {!isOwner && <QuitOrganizationCard organization={organization} />}
    </MainLayout>
  )
}

export default Edit
