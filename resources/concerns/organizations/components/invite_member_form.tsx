import Button from '@/components/button'
import Input from '@/components/input'
import Label from '@/components/label'
import useParams from '@/hooks/use_params'
import * as React from 'react'

interface InviteMemberFormProps {}

const InviteMemberForm: React.FunctionComponent<InviteMemberFormProps> = () => {
  const params = useParams()
  return (
    <form className="!w-full">
      <Label>Invite a member</Label>
      <Input id="email" placeholder="Enter the email address" />
      <Button className="mt-2" type="submit">
        Send Invite
      </Button>
    </form>
  )
}

export default InviteMemberForm
