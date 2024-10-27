import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from './currentNotificationId'
import fetchNotifications from './fetchNotifications'
import { CastWithInteractions } from '../../node_modules/@standard-crypto/farcaster-js-neynar/dist/commonjs/v1/openapi/generated/models/cast-with-interactions'

let polling = false
async function pollNotifications(
  fid: number,
  apiKey: string,
  handler: (notification: CastWithInteractions) => void,
  debug = false
) {
  if (polling) return
  polling = true
  try {
    if (debug) console.log('Polling for notifications...')
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let cursor = ''
    const notifications = [] as CastWithInteractions[]
    do {
      const {
        data: {
          result: { notifications: newNotifications, next },
        },
      } = await fetchNotifications(fid, cursor, apiKey)
      if (debug) {
        console.log('New notifications:', newNotifications)
        console.log('Next:', next)
      }
      notifications.push(...(newNotifications || []))
      if (currentNotificationId) {
        cursor = next?.cursor || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.hash === currentNotificationId
        )
      }
    } while (!!currentNotificationId && !currentNotificationIdInSet && !!cursor)
    if (notifications[0]?.hash) {
      await setCurrentNotificationId(notifications[0].hash)
    }
    for (const notification of notifications) {
      await handler(notification)
    }
    if (debug) console.log('Polling done.')
  } catch (error) {
    console.error(error)
  } finally {
    polling = false
  }
}

export function startPolling(
  fid: number,
  apiKey: string,
  handler: (notification: CastWithInteractions) => void,
  debug = false
) {
  void pollNotifications(fid, apiKey, handler, debug)
  setInterval(() => pollNotifications(fid, apiKey, handler, debug), 10 * 1000)
}
