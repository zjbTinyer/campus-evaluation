import { createContext, useState, useCallback, useEffect, useRef } from 'react'

export interface Notification {
  id: number
  type: string
  title: string
  brief: string
  isRead: boolean
  createdAt: string
  dataJson?: string
}

export const NotificationContext = createContext<{
  notifications: Notification[]
  unreadCount: number
  markRead: (id: number) => void
  markAllRead: () => void
} | null>(null)

/** 30秒轮询间隔 */
const POLL_INTERVAL = 30000

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const fetchUnreadCount = useCallback(async () => {
    try {
      // 轮询获取未读数（轻量接口）
      // const res = await fetch('/api/v1/notifications/unread-count')
      // 暂不实际调用，等待后端接口就绪
    } catch {
      // 静默失败
    }
  }, [])

  const markRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  // 启动轮询
  useEffect(() => {
    fetchUnreadCount()
    timerRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [fetchUnreadCount])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
