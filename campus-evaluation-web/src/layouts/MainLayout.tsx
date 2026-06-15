import { useLocation, useNavigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  SearchOutline,
  BellOutline,
  AppOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { useNotifications } from '../hooks/useNotifications'
import StudentSwitcher from '../components/common/StudentSwitcher'
import NotificationPanel from '../components/notification/NotificationPanel'

const tabs = [
  { key: '/search', title: '搜索', icon: <SearchOutline /> },
  { key: '/notifications', title: '通知', icon: <BellOutline /> },
  { key: '/dashboard', title: '首页', icon: <AppOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount } = useNotifications()

  // 确定当前激活 tab
  const activeKey = tabs.find((t) => location.pathname.startsWith(t.key))?.key || '/search'

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <StudentSwitcher />
        <NotificationPanel>
          <BellOutline className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </NotificationPanel>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto pb-14">{children}</div>

      {/* 底部导航 */}
      <TabBar
        activeKey={activeKey}
        onChange={(key) => navigate(key)}
        className="fixed bottom-0 left-0 right-0 border-t bg-white safe-area-bottom"
      >
        {tabs.map((tab) => (
          <TabBar.Item
            key={tab.key}
            icon={tab.icon}
            title={tab.title}
            badge={tab.key === '/notifications' && unreadCount > 0 ? unreadCount : undefined}
          />
        ))}
      </TabBar>
    </div>
  )
}
