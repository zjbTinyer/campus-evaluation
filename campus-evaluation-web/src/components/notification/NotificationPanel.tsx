import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

const TYPE_ICONS: Record<string, string> = {
  NEW_EVALUATION: '📝', LEAVE_APPROVED: '✅', LEAVE_REJECTED: '❌',
  TASK_REMINDER: '⏰', ACTIVITY_NEW: '🎉', ACTIVITY_REMINDER: '📅', ARCHIVE_PUBLISHED: '📂',
}

export default function NotificationPanel({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  const close = () => setVisible(false)

  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>

      {visible && (
        <>
          {/* 遮罩 — <button> 确保移动端可点击 */}
          <button
            type="button"
            className="fixed inset-0 w-full h-full bg-ink/20 z-40 border-none cursor-pointer"
            onClick={close}
            aria-label="关闭通知面板"
          />

          {/* 面板 */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-surface max-h-[60vh] overflow-y-auto rounded-b-2xl shadow-float">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display text-base font-bold text-ink">通知</h3>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllRead()}
                      className="text-xs text-sky"
                    >
                      全部已读
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-paper active:bg-divider transition-colors text-ink-light text-base"
                    aria-label="关闭"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <p className="text-sm text-ink-light py-8 text-center">暂无通知</p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => { markRead(n.id); close() }}
                      className={`w-full text-left p-3 rounded-card transition-colors flex items-start gap-3
                        ${!n.isRead ? 'bg-seal/5' : 'hover:bg-paper'}`}
                    >
                      <span className="relative flex-shrink-0 text-lg mt-0.5">
                        {TYPE_ICONS[n.type] || '📌'}
                        {!n.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-seal rounded-full" />
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
