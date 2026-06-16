import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import StudentSwitcher from '../components/common/StudentSwitcher'
import NotificationPanel from '../components/notification/NotificationPanel'
import { SearchIcon, HomeIcon, UserIcon } from '../components/icons'

const tabs = [
  { key: '/search',    label: '搜索', Icon: SearchIcon },
  { key: '/dashboard', label: '首页', Icon: HomeIcon },
  { key: '/profile',   label: '我的', Icon: UserIcon },
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
    <div className="flex flex-col h-screen bg-bg font-body relative">
      {/* 顶部栏 — 玻璃拟态 */}
      <header className="flex items-center justify-between px-4 py-2.5 glass sticky top-0 z-30 safe-top">
        <div className="flex items-center gap-2">
          {!isMainTab && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-fg-muted hover:text-fg active:text-primary transition-colors py-1 pr-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span className="text-xs">返回</span>
            </button>
          )}
          <StudentSwitcher />
        </div>
        <NotificationPanel>
          <button className="relative p-1.5 rounded-btn hover:bg-surface transition-colors text-fg-muted" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-accent rounded-full dot-pulse" />
            )}
          </button>
        </NotificationPanel>
      </header>

      {/* 主内容 */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-16 relative z-10">
        {children}
      </main>

      {/* 底部导航 — 玻璃拟态 */}
      <nav className="fixed bottom-0 left-0 right-0 glass-strong safe-bottom z-30 border-t border-divider">
        <div className="flex justify-around max-w-lg mx-auto">
          {tabs.map(({ key, label, Icon }) => {
            const active = key === activeKey
            return (
              <button
                key={key}
                type="button"
                onClick={() => navigate(key)}
                className={`nav-tab flex-1 py-2 ${active ? 'active' : ''}`}
              >
                <Icon size={22} className="mb-0.5" />
                <span className="text-2xs font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
