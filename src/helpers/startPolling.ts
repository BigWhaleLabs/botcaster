import { Notification } from '../models/Notification'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from './currentNotificationId'
import fetchNotifications from './fetchNotifications'

let polling = false
async function pollNotifications(
  bearerToken: string,
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
      const { result, next } = await fetchNotifications(cursor, bearerToken)
      notifications.push(...result.notifications)
      if (currentNotificationId) {
        cursor = next?.cursor || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.id === currentNotificationId
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
  bearerToken: string,
  handler: (notification: Notification) => void
) {
  void pollNotifications(bearerToken, handler)
  setInterval(() => pollNotifications(bearerToken, handler), 10 * 1000)
}
