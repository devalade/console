import MainLayout from '@/layouts/main_layout'
import * as React from 'react'
import MyAccountCard from '../components/my_account_card'
import DeleteAccountCard from '../components/delete_account_card'
import SharedLayout from '@/layouts/shared_layout'
import useMainLayoutNavigation from '@/hooks/use_main_layout_navigation'

interface ShowProps {}

const Show: React.FunctionComponent<ShowProps> = () => {
  const mainLayoutNavigation = useMainLayoutNavigation()

  return (
    <SharedLayout navigationItems={mainLayoutNavigation}>
      <h1 className="font-clash font-semibold text-3xl">Settings</h1>
      <MyAccountCard />
      <DeleteAccountCard />
    </SharedLayout>
  )
}

export default Show
