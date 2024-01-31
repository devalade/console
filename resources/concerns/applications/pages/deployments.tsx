import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Application } from '../types/application'
import ApplicationLayout from '../application_layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import type { Deployment } from '../types/deployment'
import DeploymentCard from '../components/deployment_card'

interface DeploymentsProps {
  project: Project
  application: Application
  deployments: Deployment[]
}

const Deployments: React.FunctionComponent<DeploymentsProps> = ({
  project,
  application,
  deployments,
}) => {
  return (
    <ApplicationLayout project={project} application={application}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Deployments</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <ul className="min-h-[3rem] divide-y divide-y-blue-600/20">
            {deployments.map((deployment) => {
              const isPending =
                deployment.status === 'building' || deployment.status === 'deploying'
              const deploymentsWithSuccessStatus = deployments.filter((d) => d.status === 'success')
              const isLatestDeploymentWithHasSuccessStatus =
                deployment.status === 'success' &&
                deployment.id === deploymentsWithSuccessStatus[0]?.id
              const pulse = isPending || isLatestDeploymentWithHasSuccessStatus

              return (
                <DeploymentCard
                  key={deployment.id}
                  deployment={deployment}
                  application={application}
                  project={project}
                  pulse={pulse}
                />
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

export default Deployments
