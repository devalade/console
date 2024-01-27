import Button from '@/components/button'
import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import CreateApplicationDialog from '../components/create_application_dialog'
import type { Application } from '../types/application'
import ApplicationCard from '../components/application_card'

interface IndexProps {
  project: Project
  applications: Application[]
}

const Index: React.FunctionComponent<IndexProps> = ({ project, applications }) => {
  const [showCreateApplicationDialog, setShowCreateApplicationDialog] = React.useState(false)

  return (
    <ProjectLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Applications</h1>
        <Button onClick={() => setShowCreateApplicationDialog(true)}>
          Create a new application
        </Button>
        <CreateApplicationDialog
          open={showCreateApplicationDialog}
          setOpen={setShowCreateApplicationDialog}
          project={project}
        />
      </div>
      <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {applications.map((application) => (
          <ApplicationCard key={application.id} project={project} application={application} />
        ))}
      </div>
    </ProjectLayout>
  )
}

export default Index
