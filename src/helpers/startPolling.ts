import { Notification } from '../models/Notification'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from './currentNotificationId'
import fetchNotifications from './fetchNotifications'

let polling = false
async function pollNotifications(
  fid: number,
  apiKey: string,
  handler: (notification: Notification) => void
) {
  if (polling) return
  polling = true
  try {
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let cursor = ''
    const notifications = [] as Notification[]
    do {
      const {
        data: {
          result: { notifications, next },
        },
      } = await fetchNotifications(fid, cursor, apiKey)
      notifications.push(...notifications)
      if (currentNotificationId) {
        cursor = next?.cursor || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.hash === currentNotificationId
        )
      }
    } while (!!currentNotificationId && !currentNotificationIdInSet && !!cursor)
    if (notifications[0]?.id) {
      await setCurrentNotificationId(notifications[0].id)
    }
    for (const notification of notifications) {
      await handler(notification)
    }
  } catch (error) {
    console.error(error)
  } finally {
    polling = false
  }
}

export function startPolling(
  fid: number,
  apiKey: string,
  handler: (notification: Notification) => void
) {
  void pollNotifications(fid, apiKey, handler)
  setInterval(() => pollNotifications(fid, apiKey, handler), 10 * 1000)
}
