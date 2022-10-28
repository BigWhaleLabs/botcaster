export interface Notification {
  id: string
  type?: string
  user?: {
    username?: string
  }
  cast?: {
    text?: string
    merkleRoot?: string
    publishedAt: number
  }
}
