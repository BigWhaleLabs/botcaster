import nodePersist from 'node-persist'

let initialized = false
async function checkInitialized() {
  if (initialized) return
  await nodePersist.init()
  initialized = true
}

const key = 'currentNotificationId'

export async function setCurrentNotificationId(currentNotificationId?: string) {
  await checkInitialized()
  await nodePersist.setItem(key, currentNotificationId)
}

export async function getCurrentNotificationId() {
  await checkInitialized()
  return nodePersist.getItem(key)
}
