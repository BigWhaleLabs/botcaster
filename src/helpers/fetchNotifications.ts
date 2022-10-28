import { Notification } from '../models/Notification'
import fetch from 'node-fetch'

export default function (next: string, address: string) {
  return fetch(
    next ||
      `https://api.farcaster.xyz/v1/notifications?address=${address}&per_page=10`
  ).then((res) => res.json()) as Promise<{
    result: {
      notifications?: { [key: string]: Notification }
    }
    meta?: {
      next?: string
    }
  }>
}
