import * as React from 'react'
import MembersListItem from './members_list_item'
import type { Member } from '../types/member'
import isFeatureEnabled from '@/lib/is_feature_enabled'
import BotAvatar from './bot_avatar'

interface ChatRightSidebarProps {
  members: Member[]
}

const ChatRightSidebar: React.FunctionComponent<ChatRightSidebarProps> = ({ members }) => {
  return (
    <div className="bg-white min-w-64 border-l border-zinc-200 px-8 py-5 space-y-5">
      {isFeatureEnabled('alberta') && (
        <div className="flex items-center space-x-2 text-zinc-700">
          <BotAvatar bot="Alberta" />
          <span className="text-sm">Alberta</span>
        </div>
      )}
      <div>
        <h2 className="font-medium text-sm">Members - {members.length}</h2>

        <ul className="mt-3 space-y-4">
          {members.map((member) => (
            <MembersListItem key={member.id} member={member} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChatRightSidebar
