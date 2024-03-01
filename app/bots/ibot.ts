import Channel from '#models/channel'
import Message from '#models/message'
import Organization from '#models/organization'
import User from '#models/user'

export interface IBot {
  handleMessage(
    organization: Organization,
    channel: Channel,
    user: User,
    message: Message
  ): void | Promise<void>
}
