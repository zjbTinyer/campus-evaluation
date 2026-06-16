import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { CloseIcon, CheckIcon, BellIcon } from '../icons'

const TYPE_ICONS: Record<string, string> = {
  NEW_EVALUATION: 'tag-eval', LEAVE_APPROVED: 'tag-eval', LEAVE_REJECTED: 'text-accent bg-accent/10',
  TASK_REMINDER: 'tag-task', ACTIVITY_NEW: 'tag-activity', ACTIVITY_REMINDER: 'tag-task', ARCHIVE_PUBLISHED: 'tag-archive',
}

const TYPE_LABELS: Record<string, string> = {
  NEW_EVALUATION: '评语', LEAVE_APPROVED: '批准', LEAVE_REJECTED: '驳回',
  TASK_REMINDER: '任务', ACTIVITY_NEW: '活动', ACTIVITY_REMINDER: '提醒', ARCHIVE_PUBLISHED: '档案',
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
          {/* 遮罩 */}
          <button
            type="button"
            className="fixed inset-0 w-full h-full bg-scrim z-40 border-none cursor-pointer backdrop-blur-sm"
            onClick={close}
            aria-label="关闭通知面板"
          />

          {/* 面板 — 玻璃拟态 */}
          <div className="fixed top-0 left-0 right-0 z-50 glass-strong max-h-[60vh] overflow-y-auto rounded-b-2xl shadow-float">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
                  <BellIcon size={18} />
                  通知
                </h3>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllRead()}
                      className="text-xs text-secondary font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      <CheckIcon size={12} /> 全部已读
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface active:bg-border transition-colors text-fg-muted"
                    aria-label="关闭"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-sm text-fg-muted py-8 text-center">
                  <BellIcon size={32} className="mx-auto mb-2 text-fg-dim" />
                  暂无通知
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => { markRead(n.id); close() }}
                      className={`w-full text-left p-3 rounded-card transition-all flex items-start gap-3
                        ${!n.isRead ? 'bg-primary/5 border border-primary/10' : 'hover:bg-surface'}`}
                    >
                      {/* 类型标签 */}
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-2xs font-bold
                        ${TYPE_ICONS[n.type] || 'bg-bg-elevated text-fg-muted'}`}>
                        {TYPE_LABELS[n.type] || '通'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-fg">{n.title}</span>
                          {!n.isRead && (
                            <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 dot-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-fg-muted mt-0.5">{n.brief}</div>
                      </div>
                      <span className="text-2xs text-fg-dim flex-shrink-0 mt-1">{n.createdAt.slice(5, 10)}</span>
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
