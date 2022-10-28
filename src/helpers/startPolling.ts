import { Notification } from '../models/Notification'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from './currentNotificationId'
import fetchNotifications from './fetchNotifications'

let polling = false
async function pollNotifications(
  farcasterAddress: string,
  handler: (notification: Notification) => void
) {
  if (polling) return
  polling = true
  try {
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let next = ''
    const notifications = [] as Notification[]
    do {
      const result = await fetchNotifications(next, farcasterAddress)
      const data = result.data
      notifications.push(...Object.values(data.result.notifications || {}))
      if (currentNotificationId) {
        next = data.meta?.next || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.id === currentNotificationId
        )
      }
    } while (!!currentNotificationId && !currentNotificationIdInSet && !!next)
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

export default function (
  farcasterAddress: string,
  handler: (notification: Notification) => void
) {
  void pollNotifications(farcasterAddress, handler)
  setInterval(() => pollNotifications(farcasterAddress, handler), 10 * 1000)
}
