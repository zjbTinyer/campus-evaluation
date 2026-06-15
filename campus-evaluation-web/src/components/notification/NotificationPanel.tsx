import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

const TYPE_ICONS: Record<string, string> = {
  NEW_EVALUATION: '📝', LEAVE_APPROVED: '✅', LEAVE_REJECTED: '❌',
  TASK_REMINDER: '⏰', ACTIVITY_NEW: '🎉', ACTIVITY_REMINDER: '📅', ARCHIVE_PUBLISHED: '📂',
}

export default function NotificationPanel({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>

      {visible && (
        <>
          <div className="fixed inset-0 bg-ink/20 z-40" onClick={() => setVisible(false)} />
          <div className="fixed top-0 left-0 right-0 z-50 bg-surface max-h-[60vh] overflow-y-auto rounded-b-2xl shadow-float">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display text-base font-bold text-ink">通知</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-calm">全部已读</button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-sm text-ink-light py-8 text-center">暂无通知</p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left p-3 rounded-card transition-colors flex items-start gap-3
                        ${!n.isRead ? 'bg-vermilion/5' : 'hover:bg-paper'}`}
                    >
                      <span className="relative flex-shrink-0 text-lg mt-0.5">
                        {TYPE_ICONS[n.type] || '📌'}
                        {!n.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-vermilion rounded-full" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-ink">{n.title}</div>
                        <div className="text-xs text-ink-light mt-0.5">{n.brief}</div>
                      </div>
                      <span className="text-2xs text-ink-light flex-shrink-0">{n.createdAt.slice(5, 10)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
