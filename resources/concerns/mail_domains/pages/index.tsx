import Button from '@/components/button'
import MailsLayout from '@/concerns/mails/mails_layout'
import * as React from 'react'

interface IndexProps {}

const Index: React.FunctionComponent<IndexProps> = () => {
  const [showCreateDomainDialog, setShowCreateDomainDialog] = React.useState(false)
  return (
    <MailsLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Domains</h1>
        <Button onClick={() => setShowCreateDomainDialog(true)}>Create a new domain</Button>
      </div>
    </MailsLayout>
  )
}

export default Index
