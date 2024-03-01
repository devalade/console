import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/card'
import { IconReportAnalytics } from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import type { AnalyticsWebsite } from '../types'

export type AnalyticsWebsiteCardProps = {
  analyticsWebsite: AnalyticsWebsite
}

export default function AnalyticsWebsiteCard({ analyticsWebsite }: AnalyticsWebsiteCardProps) {
  const params = useParams()
  return (
    <Link
      className="hover:opacity-75 transition-opacity"
      href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/analytics_websites/${analyticsWebsite.id}`}
    >
      <Card>
        <CardContent>
          <CardTitle className="!text-lg">{analyticsWebsite.domain}</CardTitle>
          <IconReportAnalytics className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}
