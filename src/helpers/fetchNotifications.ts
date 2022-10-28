import * as axios from 'axios'
import { Notification } from '../models/Notification'

export default function (next: string, address: string) {
  return axios.get<{
    result: {
      notifications?: { [key: string]: Notification }
    }
    meta?: {
      next?: string
    }
  }>(
    next ||
      `https://api.farcaster.xyz/v1/notifications?address=${address}&per_page=10`
  )
}
