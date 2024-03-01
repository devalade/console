import * as React from 'react'
import AnalyticsWebsitesLayout from '../components/analytics_websites_layout'
import { BarChart } from '@tremor/react'

interface ShowProps {}

const Show: React.FunctionComponent<ShowProps> = () => {
  const chartData = [
    {
      date: 'Jan 23',
      Visits: 167,
    },
    {
      date: 'Feb 23',
      Visits: 125,
    },
    {
      date: 'Mar 23',
      Visits: 156,
    },
    {
      date: 'Apr 23',
      Visits: 165,
    },
    {
      date: 'May 23',
      Visits: 153,
    },
    {
      date: 'Jun 23',
      Visits: 124,
    },
    {
      date: 'Jul 23',
      Visits: 164,
    },
    {
      date: 'Aug 23',
      Visits: 123,
    },
    {
      date: 'Sep 23',
      Visits: 132,
    },
  ]

  return (
    <AnalyticsWebsitesLayout>
      <BarChart
        className="mt-6 h-72"
        data={chartData}
        index="date"
        categories={['Visits']}
        colors={['blue']}
        valueFormatter={(number: number) => Intl.NumberFormat('us').format(number).toString()}
        yAxisWidth={48}
      />
    </AnalyticsWebsitesLayout>
  )
}

export default Show
