import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Database } from '../types/database'
import ProjectLayout from '@/layouts/project_layout'
import CreateDatabaseDialog from '../components/create_database_dialog'
import Button from '@/components/button'
import DatabaseCard from '../components/database_card'

interface IndexProps {
  project: Project
  databases: Database[]
}

const Index: React.FunctionComponent<IndexProps> = ({ project, databases }) => {
  const [showCreateDatabaseDialog, setShowCreateDatabaseDialog] = React.useState(false)

  return (
    <ProjectLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Databases</h1>
        <Button onClick={() => setShowCreateDatabaseDialog(true)}>Create a new database</Button>
        <CreateDatabaseDialog
          open={showCreateDatabaseDialog}
          setOpen={setShowCreateDatabaseDialog}
          project={project}
        />
      </div>

      <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {databases.map((database) => (
          <DatabaseCard key={database.id} database={database} project={project} />
        ))}
      </div>
    </ProjectLayout>
  )
}

export default Index
