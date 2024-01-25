import MainLayout from '@/main_layout'
import * as React from 'react'
import MyAccountCard from '../components/my_account_card'
import DeleteAccountCard from '../components/delete_account_card'

interface ShowProps {}

const Show: React.FunctionComponent<ShowProps> = () => {
  return (
    <MainLayout>
      <h1 className="font-clash font-semibold text-3xl">Settings</h1>
      <MyAccountCard />
      <DeleteAccountCard />
    </MainLayout>
  )
}

export default Show
