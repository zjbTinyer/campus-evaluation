import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import StudentSwitcher from '../components/common/StudentSwitcher'
import NotificationPanel from '../components/notification/NotificationPanel'

const tabs = [
  { key: '/search',    label: '搜索', icon: '🔍' },
  { key: '/dashboard', label: '首页', icon: '📋' },
  { key: '/profile',   label: '我的', icon: '👤' },
]

/** 主 tab 页面 — 不显示返回按钮 */
const MAIN_TABS = ['/search', '/dashboard', '/profile']

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount } = useNotifications()

  const activeKey = tabs.find((t) => location.pathname.startsWith(t.key))?.key || '/search'
  const isMainTab = MAIN_TABS.some((t) => location.pathname === t || location.pathname.startsWith(t + '/'))

  return (
    <div className="flex flex-col h-screen bg-paper font-body spine-line">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-sm border-b border-divider sticky top-0 z-30 relative">
        <div className="flex items-center gap-2">
          {!isMainTab && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-ink-light hover:text-ink active:text-primary transition-colors py-1 pr-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs">返回</span>
            </button>
          )}
          <StudentSwitcher />
        </div>
        <NotificationPanel>
          <button className="relative p-1.5 rounded-btn hover:bg-paper transition-colors" type="button">
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-seal rounded-full dot-pulse" />
            )}
          </button>
        </NotificationPanel>
      </header>

      {/* 主内容 */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-16 relative">
        {children}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider safe-bottom z-30">
        <div className="flex justify-around max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
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
