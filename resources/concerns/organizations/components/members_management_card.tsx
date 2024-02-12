import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card'
import * as React from 'react'
import InviteMemberForm from './invite_member_form'
import getInitials from '@/lib/initials'

interface MembersManagementCardProps {
  organization: {
    name: string
    slug: string
    members: Array<{
      id: number
      role: 'owner' | 'member'
      user: {
        fullName: string
        email: string
      }
    }>
  }
}

const MembersManagementCard: React.FunctionComponent<MembersManagementCardProps> = ({
  organization,
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle> Members</CardTitle>
        <CardDescription>Manage and invite Team Members</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {organization.members.map((member) => (
            <li className="flex items-center gap-x-4 py-3 text-sm leading-6 font-normal text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border-zinc-700 border text-zinc-200">
                <span className="font-medium">{getInitials(member.user.fullName)}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-x-2">
                  <span className="font-medium">{member.user.fullName}</span>
                  <span className="bg-accent text-blue-950 text-xs px-1 rounded-md border border-blue-600/20">
                    {member.role === 'owner' ? 'Owner' : 'Member'}
                  </span>
                </div>
                <span className=" text-zinc-600 text-sm">{member.user.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <InviteMemberForm />
      </CardFooter>
    </Card>
  )
}

export default MembersManagementCard
