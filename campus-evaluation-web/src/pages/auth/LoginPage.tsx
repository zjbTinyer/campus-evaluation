import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import type { Theme } from '../../contexts/ThemeContext'
import { BookIcon, LeafIcon, SparkleIcon, CheckIcon } from '../../components/icons'

const THEMES: { key: Theme; label: string; Icon: typeof BookIcon; colors: string[] }[] = [
  { key: 'scholarly', label: '墨韵流光', Icon: BookIcon, colors: ['#1a1a2e', '#d4a574', '#5b7fbd'] },
  { key: 'vibrant',   label: '霓虹校园', Icon: LeafIcon, colors: ['#0a0a0f', '#00ff88', '#b347ea'] },
  { key: 'journal',   label: '极光星辰', Icon: SparkleIcon, colors: ['#020203', '#5e6ad2', '#f59e0b'] },
]

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'password'>('phone')
  const { login } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleNext = () => {
    if (phone.length >= 11) setStep('password')
  }

  const handleLogin = async () => {
    setLoading(true)
    setTimeout(() => {
      login('mock-jwt-token', 1, phone)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center px-6">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-glow-sm pulse-glow">
          <span className="font-display text-3xl text-primary font-bold">书</span>
        </div>
        <h1 className="font-display text-hero font-bold text-fg mb-2 tracking-wide">
          校园评价
        </h1>
        <p className="text-sm text-fg-muted tracking-wider">
          观其行 · 知其进
        </p>
      </div>

      {/* 登录表单 */}
      <div className="max-w-sm mx-auto w-full space-y-4">
        {step === 'phone' ? (
          <>
            <label className="block text-xs font-medium text-fg-muted mb-1 ml-1 tracking-wide">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
              className="input-base text-base"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={phone.length < 11}
              className="w-full py-3.5 rounded-btn bg-primary text-bg font-medium text-sm tracking-wide
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:opacity-90 active:scale-[0.98] transition-all shadow-glow-sm"
            >
              下一步
            </button>
          </>
        ) : (
          <>
            <label className="block text-xs font-medium text-fg-muted mb-1 ml-1 tracking-wide">
              密码 · {phone}
              <button onClick={() => setStep('phone')} className="ml-2 text-secondary font-normal hover:opacity-80">修改</button>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="input-base text-base"
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-3.5 rounded-btn bg-primary text-bg font-medium text-sm tracking-wide
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:opacity-90 active:scale-[0.98] transition-all shadow-glow-sm"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </>
        )}

        {/* 微信登录 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-divider" /></div>
          <div className="relative flex justify-center"><span className="bg-bg px-4 text-xs text-fg-muted">或</span></div>
        </div>

        <button className="w-full py-3.5 rounded-btn border border-divider bg-surface text-fg text-sm font-medium tracking-wide
                           hover:bg-surface-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-success">
            <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.94 4.17c-.4.52-.56 1.08-.56 1.43 0 .37.17.73.44 1 .27.27.7.4 1.16.4h7c.47 0 .89-.13 1.16-.4.27-.27.44-.63.44-1 0-.35-.16-.91-.56-1.43-.39-.5-.98-.92-1.69-1.21-.64-.26-1.12-.38-1.55-.38-.43 0-.78.17-1.17.52-.3.27-.63.48-.63.48s-.33-.21-.63-.48c-.39-.35-.74-.52-1.17-.52-.43 0-.91.12-1.55.38-.71.29-1.3.71-1.69 1.21z"/>
          </svg>
          微信一键登录
        </button>
      </div>

      {/* 风格切换 */}
      <div className="max-w-sm mx-auto w-full mt-8 pt-6 border-t border-divider">
        <p className="text-center text-2xs text-fg-muted mb-3">选择界面风格</p>
        <div className="flex justify-center gap-2">
          {THEMES.map((t) => {
            const active = theme === t.key
            const { Icon } = t
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTheme(t.key)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-btn border transition-all active:scale-95
                  ${active
                    ? 'border-primary bg-primary/10 text-primary shadow-glow-sm'
                    : 'border-divider bg-surface text-fg-muted hover:border-border-light'
                  }`}
              >
                {/* 微缩色块预览 */}
                <div className="flex gap-0.5 h-1.5 w-8 rounded-full overflow-hidden">
                  {t.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <Icon size={14} />
                <span className="text-2xs font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-2xs text-fg-muted mt-6 tracking-wide">
        登录即表示同意服务协议和隐私政策
      </p>
    </div>
  )
}
