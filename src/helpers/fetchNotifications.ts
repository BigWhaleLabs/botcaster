import { Notification } from '../models/Notification'
import axios from 'axios'

export default function (cursor: string, bearerToken: string) {
  return axios.get<{
    result: { notifications: Notification[] }
    next?: { cursor?: string }
  }>(
    cursor
      ? `https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10&cursor=${cursor}`
      : 'https://api.farcaster.xyz/v2/mention-and-reply-notifications?limit=10',
    {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`,
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    }
  )
}
