import { Notification } from '../models/Notification'
import ky from 'ky'

export default function (cursor: string, bearerToken: string) {
  return ky(
    cursor
      ? `https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10&cursor=${cursor}`
      : 'https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10',
    {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    }
  ).json() as Promise<{
    result: { notifications: Notification[] }
    next?: { cursor?: string }
  }>
}
