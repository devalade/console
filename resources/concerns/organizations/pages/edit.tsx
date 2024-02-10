import * as React from 'react'
import CreateOrganizationDialog from '../components/create_organization_dialog'
import MainLayout from '@/layouts/main_layout'
import EditOrganizationCard from '../components/edit_organization_card'
import DestroyOrganizationCard from '../components/destroy_organization_card'

interface IndexProps {
  organization: { name: string; slug: string }
}

const Index: React.FunctionComponent<IndexProps> = ({ organization }) => {
  return (
    <MainLayout>
      <h1 className="font-clash font-semibold text-3xl">Organization Settings</h1>

      <EditOrganizationCard organization={organization} />

      <DestroyOrganizationCard organization={organization} />
    </MainLayout>
  )
}

export default Index
