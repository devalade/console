import { Link } from '@inertiajs/react'
import * as React from 'react'

interface TabProps {
  label: string
  href: string
}

const Tab: React.FunctionComponent<TabProps> = ({ href, label }) => {
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

export default Tab
