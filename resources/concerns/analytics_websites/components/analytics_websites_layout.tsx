import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import AnalyticsWebsitesBreadcrumbs from './analytics_websites_breadcrumbs'
import AnalyticsWebsitesTabs from './analytics_websites_tabs'

interface AnalyticsWebsitesLayoutProps extends React.PropsWithChildren {}

const AnalyticsWebsitesLayout: React.FunctionComponent<AnalyticsWebsitesLayoutProps> = ({
  children,
}) => {
  return (
    <ProjectLayout className="!p-0">
      <AnalyticsWebsitesBreadcrumbs />
      <AnalyticsWebsitesTabs />
      <div className="py-2 px-12">{children}</div>
    </ProjectLayout>
  )
}

export default AnalyticsWebsitesLayout
