import Button from '@/components/button'
import MailsLayout from '@/concerns/mails/mails_layout'
import { IconCirclePlus, IconPlus } from '@tabler/icons-react'
import * as React from 'react'

interface IndexProps {}

const Index: React.FunctionComponent<IndexProps> = () => {
  const [showCreateDomainDialog, setShowCreateDomainDialog] = React.useState(false)
  return (
    <MailsLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Domains</h1>
        <Button onClick={() => setShowCreateDomainDialog(true)}>
          <IconCirclePlus className="w-4 h-4" />
          <span>Create a new domain</span>
        </Button>
      </div>
      <p className="mt-2 text-zinc-800 text-sm">Use your own domains to send your emails.</p>
    </MailsLayout>
  )
}

export default Index
