import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown_menu'
import { Link } from '@inertiajs/react'
import useUser from '@/hooks/use_user'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import Avatar from './avatar'

interface AccountDropdownProps {}

const AccountDropdown: React.FunctionComponent<AccountDropdownProps> = () => {
  const user = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-x-4 py-3 text-sm leading-6 font-normal text-zinc-900 hover:opacity-75 transition">
          <Avatar user={user} />
          <span aria-hidden="true">{user.email}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              <IconSettings className="mr-2 h-4 w-4" />

              <span>Account Settings</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <form action="/auth/sign_out" method="POST">
            <button type="submit" hidden id="sign-out-button" />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => document.getElementById('sign-out-button')?.click()}
            >
              <IconLogout className="mr-2 h-4 w-4" />

              <span>Sign Out</span>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountDropdown
