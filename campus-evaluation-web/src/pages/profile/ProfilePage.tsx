import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { useTheme } from '../../hooks/useTheme'
import type { Theme } from '../../contexts/ThemeContext'
import { isMockMode, setApiMode } from '../../api'

export default function ProfilePage() {
  const { auth, logout } = useAuth()
  const { linkedStudents } = useCurrentStudent()
  const { theme, setTheme } = useTheme()
  const [mock, setMock] = useState(isMockMode())

  const THEMES: { key: Theme; label: string; desc: string; icon: string }[] = [
    { key: 'scholarly', label: '墨韵书香', desc: '靛青·泥金·宋体', icon: '📖' },
    { key: 'vibrant',   label: '生机校园', desc: '翠绿·天蓝·清爽', icon: '🌱' },
    { key: 'journal',   label: '成长手账', desc: '浆果紫·薄荷·圆润', icon: '🧸' },
  ]

  const handleToggleMode = (checked: boolean) => {
    setMock(checked)
    setApiMode(checked ? 'mock' : 'real')
  }

  return (
    <div className="p-4 pb-20">
      {/* 用户信息 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4 flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-paper flex items-center justify-center text-lg font-display text-ink">
          👤
        </span>
        <div>
          <div className="font-medium text-ink">{auth.phone || '未设置'}</div>
          <div className="text-xs text-ink-light">家长</div>
        </div>
      </div>

      {/* 主题切换 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4">
        <h3 className="text-sm font-medium text-ink mb-3">界面风格</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTheme(t.key)}
              className={`flex flex-col items-center gap-1 p-3 rounded-card border transition-all active:scale-95
                ${theme === t.key
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-divider bg-white text-ink-light hover:border-divider-strong'
                }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs font-medium">{t.label}</span>
              <span className="text-2xs opacity-60">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* API 模式 */}
      <div className="rounded-card bg-surface border border-divider p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-medium text-ink">API 模式</div>
            <div className="text-xs text-ink-light">当前: {mock ? 'Mock 数据' : '真实接口'}</div>
          </div>
          <button onClick={() => handleToggleMode(!mock)}
            className={`relative w-11 h-6 rounded-full transition-colors ${mock ? 'bg-gold' : 'bg-primary'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${mock ? 'left-0.5' : 'left-[1.375rem]'}`} />
          </button>
        </div>
        <p className="text-2xs text-ink-light bg-paper p-2 rounded-btn">
          💡 关闭 Mock 后将调用真实后端 API。也可通过 URL 参数 <code className="text-sky">?mock=false</code> 控制。
        </p>
      </div>

      {/* 关联学生 */}
      <div className="rounded-card bg-surface border border-divider mb-4 overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-medium text-ink border-b border-divider">我的孩子</h3>
        {linkedStudents.map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center gap-3 border-b border-divider last:border-0">
            <span className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-xs font-display">{s.name[0]}</span>
            <div>
              <div className="text-sm text-ink">{s.name}</div>
              <div className="text-2xs text-ink-light">{s.className}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 退出 */}
      <button onClick={logout}
        className="w-full py-3 rounded-btn border border-seal/30 text-seal text-sm font-medium
                   active:bg-seal/5 transition-colors">
        退出登录
      </button>
    </div>
  )
}
