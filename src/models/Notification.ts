export interface Notification {
  id: string
  type?: string
  actor?: {
    username?: string
  }
  content: {
    cast?: {
      text?: string
      hash?: string
      threadHash?: string
      parentHash?: string
      timestamp: number
    }
  }
}
