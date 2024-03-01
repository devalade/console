import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import MailsBreadcrumbs from './components/mails_breadcrumbs'
import MailsTabs from './components/mails_tabs'

interface MailsLayoutProps extends React.PropsWithChildren {}

const MailsLayout: React.FunctionComponent<MailsLayoutProps> = ({ children }) => {
  return (
    <ProjectLayout className="!p-0">
      <MailsBreadcrumbs />
      <MailsTabs />
      <div className="py-8 px-12">{children}</div>
    </ProjectLayout>
  )
}

export default MailsLayout
