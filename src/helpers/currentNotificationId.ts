import { getItem, init, setItem } from 'node-persist'

let initialized = false
async function checkInitialized() {
  if (initialized) return
  await init()
  initialized = true
}

const key = 'currentNotificationId'

export async function setCurrentNotificationId(currentNotificationId?: string) {
  await checkInitialized()
  await setItem(key, currentNotificationId)
}

export async function getCurrentNotificationId() {
  await checkInitialized()
  return getItem(key)
}
