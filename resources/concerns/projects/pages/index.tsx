import Button from '@/components/button'
import MainLayout from '@/layouts/main_layout'
import * as React from 'react'
import ProjectCard from '../components/project_card'
import CreateProjectDialog from '../components/create_project_dialog'

interface IndexProps {
  projects: Array<Project>
}

const Index: React.FunctionComponent<IndexProps> = ({ projects }) => {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = React.useState(false)

  return (
    <MainLayout>
      <CreateProjectDialog open={showCreateProjectDialog} setOpen={setShowCreateProjectDialog} />

      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Projects</h1>
        <Button onClick={() => setShowCreateProjectDialog(true)}>Create new project</Button>
      </div>

      <div className="py-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </MainLayout>
  )
}

export default Index
