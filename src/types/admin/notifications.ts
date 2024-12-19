export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  type: "message" | "alert" | "update"
}
