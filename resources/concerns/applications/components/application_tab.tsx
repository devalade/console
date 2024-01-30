import { Link } from '@inertiajs/react'
import * as React from 'react'

interface ApplicationTabProps {
  label: string
  href: string
}

const ApplicationTab: React.FunctionComponent<ApplicationTabProps> = ({ href, label }) => {
  const isActive = window.location.pathname === href
  return (
    <li>
      <Link
        href={href}
        className={`${isActive ? 'text-blue-600' : 'hover:text-blue-600'} whitespace-nowrap`}
      >
        {label}
      </Link>
    </li>
  )
}

export default ApplicationTab
