import * as React from 'react'
import useMainLayoutNavigation from '@/hooks/use_main_layout_navigation'
import SharedLayout from './shared_layout'

export default function MainLayout({ children }: React.PropsWithChildren) {
  const mainLayoutNavigation = useMainLayoutNavigation()

  return <SharedLayout children={children} navigationItems={mainLayoutNavigation} />
}
