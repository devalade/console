import Button from '@/components/button'
import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'

interface IndexProps {}

const Index: React.FunctionComponent<IndexProps> = () => {
  const [showCreateGitRepositoryDialog, setShowCreateGitRepositoryDialog] = React.useState(false)
  return (
    <ProjectLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Git Repositories</h1>
        <Button onClick={() => setShowCreateGitRepositoryDialog(true)}>
          Create a new Git repository
        </Button>
      </div>
    </ProjectLayout>
  )
}

export default Index
