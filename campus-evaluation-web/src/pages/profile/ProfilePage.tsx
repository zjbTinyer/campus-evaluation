import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { useTheme } from '../../hooks/useTheme'
import type { Theme } from '../../contexts/ThemeContext'
import { isMockMode, setApiMode } from '../../api'
import {
  UserIcon, BookIcon, LeafIcon, SparkleIcon, LogoutIcon,
  CheckIcon,
} from '../../components/icons'

const THEMES: { key: Theme; label: string; desc: string; Icon: typeof BookIcon; colors: string[] }[] = [
  { key: 'scholarly', label: '墨韵流光', desc: '新中式 · 暗金 · 水墨', Icon: BookIcon, colors: ['#1a1a2e', '#d4a574', '#5b7fbd'] },
  { key: 'vibrant',   label: '霓虹校园', desc: '赛博朋克 · 霓虹绿 · 暗黑', Icon: LeafIcon, colors: ['#0a0a0f', '#00ff88', '#b347ea'] },
  { key: 'journal',   label: '极光星辰', desc: '深邃星空 · 极光紫 · 靛蓝', Icon: SparkleIcon, colors: ['#020203', '#5e6ad2', '#f59e0b'] },
]

export default function ProfilePage() {
  const { auth, logout } = useAuth()
  const { linkedStudents } = useCurrentStudent()
  const { theme, setTheme } = useTheme()
  const [mock, setMock] = useState(isMockMode())

  const handleToggleMode = (checked: boolean) => {
    setMock(checked)
    setApiMode(checked ? 'mock' : 'real')
  }

  return (
    <div className="p-4 pb-20">
      {/* 用户信息 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-bg-elevated flex items-center justify-center border border-divider">
          <UserIcon size={22} className="text-fg-muted" />
        </div>
        <div>
          <div className="font-medium text-fg">{auth.phone || '未设置'}</div>
          <div className="text-xs text-fg-muted">家长</div>
        </div>
      </div>

      {/* 主题切换 — 视觉预览选择器 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4">
        <h3 className="text-sm font-medium text-fg mb-3">界面风格</h3>
        <div className="flex flex-col gap-2">
          {THEMES.map((t) => {
            const active = theme === t.key
            const { Icon } = t
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTheme(t.key)}
                className={`flex items-center gap-3 p-3 rounded-card border transition-all active:scale-[0.98]
                  ${active
                    ? 'border-primary bg-primary/5 shadow-glow-sm'
                    : 'border-divider bg-surface hover:border-border-light'
                  }`}
              >
                {/* 色块预览 */}
                <div className="flex-shrink-0 w-10 h-10 rounded-btn overflow-hidden flex border border-divider"
                  style={{ background: t.colors[0] }}>
                  <div className="w-1/2 h-full" style={{ background: t.colors[1], opacity: 0.7 }} />
                  <div className="w-1/2 h-full" style={{ background: t.colors[2], opacity: 0.5 }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <Icon size={16} className={active ? 'text-primary' : 'text-fg-muted'} />
                    <span className={`text-sm font-medium ${active ? 'text-primary' : 'text-fg'}`}>{t.label}</span>
                    {active && <CheckIcon size={14} className="text-primary flex-shrink-0 ml-auto" />}
                  </div>
                  <span className="text-2xs text-fg-muted">{t.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* API 模式 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-medium text-fg">API 模式</div>
            <div className="text-xs text-fg-muted">当前: {mock ? 'Mock 数据' : '真实接口'}</div>
          </div>
          <button onClick={() => handleToggleMode(!mock)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${mock ? 'bg-gold' : 'bg-primary'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300
              ${mock ? 'left-0.5' : 'left-[1.375rem]'}`} />
          </button>
        </div>
        <p className="text-2xs text-fg-muted bg-bg-elevated p-2 rounded-btn">
          💡 关闭 Mock 后将调用真实后端 API。也可通过 URL 参数 <code className="text-secondary">?mock=false</code> 控制。
        </p>
      </div>

      {/* 关联学生 */}
      <div className="rounded-card bg-surface border border-divider mb-4 overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-medium text-fg border-b border-divider">我的孩子</h3>
        {linkedStudents.map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center gap-3 border-b border-divider last:border-0">
            <span className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-display text-fg-muted border border-divider">
              {s.name[0]}
            </span>
            <div>
              <div className="text-sm text-fg">{s.name}</div>
              <div className="text-2xs text-fg-muted">{s.className}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 退出 */}
      <button onClick={logout}
        className="w-full py-3 rounded-btn border border-accent/30 text-accent text-sm font-medium
                   active:bg-accent/5 transition-colors flex items-center justify-center gap-2">
        <LogoutIcon size={16} />
        退出登录
      </button>
    </div>
  )
}
