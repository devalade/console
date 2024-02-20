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
import type { Organization } from '../types/organization'
import clsx from 'clsx'
import Avatar from '@/components/avatar'

interface MembersManagementCardProps {
  organization: Organization
  isOwner: boolean
}

const MembersManagementCard: React.FunctionComponent<MembersManagementCardProps> = ({
  organization,
  isOwner,
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage and invite Team Members</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {organization.members.map((member) => (
            <li className="flex items-center gap-x-4 py-3 text-sm leading-6 font-normal text-zinc-900">
              <Avatar user={member.user} />
              <div className="flex flex-col">
                <div className="flex items-center gap-x-2">
                  <span className="font-medium">{member.user.fullName}</span>
                  <span
                    className={clsx(
                      'text-xs px-1 rounded-md border',
                      member.role === 'owner'
                        ? 'bg-accent border-blue-600/20 text-blue-950'
                        : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    )}
                  >
                    {member.role === 'owner' ? 'Owner' : 'Member'}
                  </span>
                </div>
                <span className=" text-zinc-600 text-sm">{member.user.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      {isOwner && (
        <CardFooter>
          <InviteMemberForm />
        </CardFooter>
      )}
    </Card>
  )
}

export default MembersManagementCard
