import SharedLayout from '@/layouts/shared_layout'
import * as React from 'react'
import CreateOrganizationDialog from '../components/create_organization_dialog'

interface IndexProps {}

const Index: React.FunctionComponent<IndexProps> = () => {
  return (
    <SharedLayout navigationItems={[]}>
      <CreateOrganizationDialog open={true} setOpen={() => {}} />
    </SharedLayout>
  )
}

export default Index
