import * as React from 'react'
import AnalyticsWebsitesLayout from '../components/analytics_websites_layout'
import DestroyAnalyticsWebsiteCard from '../components/destroy_analytics_website_dialog'

interface EditProps {}

const Edit: React.FunctionComponent<EditProps> = () => {
  return (
    <AnalyticsWebsitesLayout>
      <DestroyAnalyticsWebsiteCard />
    </AnalyticsWebsitesLayout>
  )
}

export default Edit
