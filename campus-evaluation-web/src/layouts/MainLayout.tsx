import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import StudentSwitcher from '../components/common/StudentSwitcher'
import NotificationPanel from '../components/notification/NotificationPanel'

const tabs = [
  { key: '/search',    label: '搜索', icon: '🔍' },
  { key: '/dashboard', label: '首页', icon: '📋' },
  { key: '/profile',   label: '我的', icon: '👤' },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount } = useNotifications()

  const activeKey = tabs.find((t) => location.pathname.startsWith(t.key))?.key || '/search'

  return (
    <div className="flex flex-col h-screen bg-paper font-body">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-surface/90 backdrop-blur border-b border-divider sticky top-0 z-30">
        <StudentSwitcher />
        <NotificationPanel>
          <button className="relative p-1.5 rounded-btn hover:bg-paper transition-colors">
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-vermilion rounded-full dot-pulse" />
            )}
          </button>
        </NotificationPanel>
      </header>

      {/* 主内容 */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-16">
        {children}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-divider safe-bottom z-30">
        <div className="flex justify-around max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => navigate(tab.key)}
              className={`nav-tab flex-1 py-2 ${tab.key === activeKey ? 'active' : ''}`}
            >
              <span className="text-lg mb-0.5">{tab.icon}</span>
              <span className="text-2xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
