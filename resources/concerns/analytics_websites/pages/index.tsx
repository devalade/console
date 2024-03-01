import Button from '@/components/button'
import ProjectLayout from '@/layouts/project_layout'
import { IconCirclePlus } from '@tabler/icons-react'
import * as React from 'react'
import AddWebsiteDialog from '../components/add_website_dialog'
import type { AnalyticsWebsite } from '../types'
import AnalyticsWebsiteCard from '../components/analytics_website_card'

interface IndexProps {
  analyticsWebsites: AnalyticsWebsite[]
}

const Index: React.FunctionComponent<IndexProps> = ({ analyticsWebsites }) => {
  const [showCreateAnalyticsWebsiteDialog, setShowCreateAnalyticsWebsiteDialog] =
    React.useState(false)
  return (
    <ProjectLayout>
      <AddWebsiteDialog
        open={showCreateAnalyticsWebsiteDialog}
        setOpen={setShowCreateAnalyticsWebsiteDialog}
      />
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Analytics</h1>
        <Button onClick={() => setShowCreateAnalyticsWebsiteDialog(true)}>
          <IconCirclePlus className="w-4 h-4" />
          <span>Add a website</span>
        </Button>
      </div>
      <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsWebsites.map((analyticsWebsite) => (
          <AnalyticsWebsiteCard key={analyticsWebsite.id} analyticsWebsite={analyticsWebsite} />
        ))}
      </div>
    </ProjectLayout>
  )
}

export default Index
