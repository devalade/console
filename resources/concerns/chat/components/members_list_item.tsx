import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import { Link } from '@inertiajs/react'
import useUser from '@/hooks/use_user'
import {
  IconLogout,
  IconMessage,
  IconMessageCirclePlus,
  IconMessageForward,
  IconSettings,
} from '@tabler/icons-react'
import getInitials from '@/lib/initials'
import type { Member } from '../types/member'
import useParams from '@/hooks/use_params'

interface MembersListItemProps {
  member: Member
}

const MembersListItem: React.FunctionComponent<MembersListItemProps> = ({ member }) => {
  const params = useParams()
  const user = useUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={user.id === member.id}>
        <button className="flex items-center space-x-2 text-zinc-700">
          <div className="flex h-7 w-7 text-sm items-center justify-center rounded-full bg-zinc-800 border-zinc-700 border text-zinc-200">
            <span className="text-sm">{getInitials(member.fullName)}</span>
          </div>
          <span className="text-sm">{member.fullName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <form
            action={`/organizations/${params.organizationSlug}/chat/conversations`}
            method="POST"
          >
            <input type="hidden" name="memberId" value={member.id} />
            <button type="submit" hidden id="create-conversation-button" />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => document.getElementById('sign-out-button')?.click()}
            >
              <IconMessageForward className="mr-2 h-4 w-4" />

              <span>Send Message</span>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MembersListItem
