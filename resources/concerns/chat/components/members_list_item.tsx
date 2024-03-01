import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import useUser from '@/hooks/use_user'
import { IconMessageForward } from '@tabler/icons-react'
import type { Member } from '../types/member'
import useParams from '@/hooks/use_params'
import clsx from 'clsx'
import Avatar from '@/components/avatar'

interface MembersListItemProps {
  member: Member
}

const MembersListItem: React.FunctionComponent<MembersListItemProps> = ({ member }) => {
  const params = useParams()
  const user = useUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={user.id === member.id}>
        <button
          className={clsx(
            'flex items-center space-x-2 text-zinc-700',
            user.id !== member.id && 'hover:opacity-80'
          )}
        >
          <Avatar user={member} />
          <span className="text-sm">{member.fullName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <form
            action={`/organizations/${params.organizationSlug}/conversations`}
            method="POST"
            id="create-conversation-form"
          >
            <input type="hidden" name="memberId" value={member.id} />
            <button type="submit" className="w-full">
              <DropdownMenuItem className="cursor-pointer">
                <IconMessageForward className="mr-2 h-4 w-4" />

                <span>Send Message</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MembersListItem
