import Button from '@/components/button'
import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import CreateDevMachineDialog from '../components/create_dev_machine_dialog'

interface IndexProps {}

const Index: React.FunctionComponent<IndexProps> = () => {
  const [showCreateDevMachineDialog, setShowCreateDevMachineDialog] = React.useState(false)
  return (
    <ProjectLayout>
      <CreateDevMachineDialog
        open={showCreateDevMachineDialog}
        setOpen={setShowCreateDevMachineDialog}
      />
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Dev Machines</h1>
        <Button onClick={() => setShowCreateDevMachineDialog(true)}>
          Create a new dev machine
        </Button>
      </div>
    </ProjectLayout>
  )
}

export default Index
