import { NeynarAPIClient } from '@standard-crypto/farcaster-js-neynar'

export default function (fid: number, cursor: string, apiKey: string) {
  const client = new NeynarAPIClient(apiKey)
  return client.v1.apis.notifications.mentionsAndReplies({
    fid,
    cursor,
    limit: 10,
  })
}
