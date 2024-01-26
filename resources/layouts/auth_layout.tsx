import * as React from 'react'
import Logo from '@/components/logo'

interface AuthLayoutProps {}

const AuthLayout: React.FunctionComponent<React.PropsWithChildren<AuthLayoutProps>> = ({
  children,
}) => {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <a
          className="relative z-20 flex items-center text-lg font-medium space-x-2 hover:opacity-75 transition-opacity"
          href="https://www.softwarecitadel.com"
        >
          <Logo variant="light" />
          <span className="font-clash text-xl">Software Citadel</span>
        </a>
      </div>
      {children}
    </div>
  )
}

export default AuthLayout
