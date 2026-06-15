import { createContext, useState, useCallback, useEffect, useRef } from 'react'
import { MOCK_NOTIFICATIONS } from '../api/mock'

export interface Notification {
  id: number
  type: string
  title: string
  brief: string
  isRead: boolean
  createdAt: string
  studentId: string | null
  dataJson?: string
}

export const NotificationContext = createContext<{
  notifications: Notification[]
  unreadCount: number
  markRead: (id: number) => void
  markAllRead: () => void
} | null>(null)

const POLL_INTERVAL = 30000

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // 加载 Mock 通知
  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}
