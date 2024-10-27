import { Notification } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from './currentNotificationId'
import fetchNotifications from './fetchNotifications'

let polling = false
async function pollNotifications(
  fid: number,
  apiKey: string,
  handler: (notification: Notification) => void,
  debug = false
) {
  if (polling) return
  polling = true
  try {
    if (debug) console.log('Polling for notifications...')
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let cursor = ''
    const notifications = [] as Notification[]
    do {
      const { notifications: newNotifications, next } =
        await fetchNotifications(fid, cursor, apiKey)
      if (debug) {
        console.log('New notifications:', newNotifications)
        console.log('Next:', next)
      }
      notifications.push(...(newNotifications || []))
      if (currentNotificationId) {
        cursor = next?.cursor || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.cast?.hash && n.cast.hash === currentNotificationId
        )
      }
    } while (!!currentNotificationId && !currentNotificationIdInSet && !!cursor)
    if (notifications[0]?.cast?.hash) {
      await setCurrentNotificationId(notifications[0].cast.hash)
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
  handler: (notification: Notification) => void,
  debug = false
) {
  void pollNotifications(fid, apiKey, handler, debug)
  setInterval(() => pollNotifications(fid, apiKey, handler, debug), 10 * 1000)
}
