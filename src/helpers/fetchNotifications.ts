import { Notification } from '../models/Notification'
import fetch from 'unfetch'

export default function (cursor: string, bearerToken: string) {
  return fetch(
    cursor
      ? `https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10&cursor=${cursor}`
      : 'https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10',
    {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    }
  ).then((res) => res.json()) as Promise<{
    result: { notifications: Notification[] }
    next?: { cursor?: string }
  }>
}
