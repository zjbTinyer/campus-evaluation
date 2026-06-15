import { useState } from 'react'
import { Popup, List, Empty } from 'antd-mobile'
import {
  StarOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  UnorderedListOutline,
} from 'antd-mobile-icons'
import { useNotifications } from '../../hooks/useNotifications'

/** 通知类型 → 图标映射 */
const TYPE_ICONS: Record<string, React.ReactNode> = {
  NEW_EVALUATION: <StarOutline />,
  LEAVE_APPROVED: <CheckCircleOutline />,
  LEAVE_REJECTED: <CloseCircleOutline />,
  TASK_REMINDER: <UnorderedListOutline />,
  ACTIVITY_NEW: <StarOutline />,
  ACTIVITY_REMINDER: <StarOutline />,
  ARCHIVE_PUBLISHED: <StarOutline />,
}

/** 通知类型 → 颜色映射 */
const TYPE_COLORS: Record<string, string> = {
  NEW_EVALUATION: '#1677ff',
  LEAVE_APPROVED: '#52c41a',
  LEAVE_REJECTED: '#ff4d4f',
  TASK_REMINDER: '#faad14',
  ACTIVITY_NEW: '#1677ff',
  ACTIVITY_REMINDER: '#faad14',
  ARCHIVE_PUBLISHED: '#722ed1',
}

/**
 * 通知面板 — 可折叠的顶部通知列表
 */
export default function NotificationPanel({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setVisible(true)}>
        {children}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        position="top"
        bodyStyle={{ maxHeight: '50vh', overflow: 'auto' }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold">消息通知</h3>
            {unreadCount > 0 && (
              <span
                className="text-xs text-blue-500 cursor-pointer"
                onClick={markAllRead}
              >
                全部已读
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <Empty description="暂无通知" />
          ) : (
            <List>
              {notifications.map((n) => (
                <List.Item
                  key={n.id}
                  prefix={
                    <span className="relative inline-block">
                      <span
                        className="text-lg"
                        style={{ color: TYPE_COLORS[n.type] || '#999' }}
                      >
                        {TYPE_ICONS[n.type] || <StarOutline />}
                      </span>
                      {!n.isRead && (
                        <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </span>
                  }
                  description={n.brief}
                  onClick={() => markRead(n.id)}
                  className={!n.isRead ? 'bg-blue-50' : ''}
                >
                  {n.title}
                </List.Item>
              ))}
            </List>
          )}
        </div>
      </Popup>
    </>
  )
}
