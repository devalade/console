import * as React from 'react'
import Alberta from '../alberta_sql.webp'

interface BotAvatarProps {
  bot: string
}

const BotAvatar: React.FunctionComponent<BotAvatarProps> = ({ bot }) => {
  if (bot === 'Alberta') {
    return <img src={Alberta} alt="AlbertSQL" className="h-8 w-8 rounded-full" />
  }
  return null
}

export default BotAvatar
