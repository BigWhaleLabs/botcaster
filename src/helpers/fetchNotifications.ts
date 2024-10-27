import { NeynarAPIClient } from '@neynar/nodejs-sdk'

export default function (fid: number, cursor: string, apiKey: string) {
  const client = new NeynarAPIClient(apiKey)
  return client.fetchAllNotifications(fid, {
    cursor,
    isPriority: false,
    priorityMode: false,
  })
}
