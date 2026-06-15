import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import type { Theme } from '../../contexts/ThemeContext'

const THEMES: { key: Theme; label: string; icon: string }[] = [
  { key: 'scholarly', label: '墨韵书香', icon: '📖' },
  { key: 'vibrant',   label: '生机校园', icon: '🌱' },
  { key: 'journal',   label: '成长手账', icon: '🧸' },
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
    <div className="min-h-screen bg-paper flex flex-col justify-center px-6">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-6">
          <span className="font-display text-3xl text-primary font-bold">书</span>
        </div>
        <h1 className="font-display text-hero font-bold text-ink mb-2 tracking-wide">
          校园评价
        </h1>
        <p className="text-sm text-ink-light tracking-wider">
          观其行 · 知其进
        </p>
      </div>

      {/* 登录表单 */}
      <div className="max-w-sm mx-auto w-full space-y-4">
        {step === 'phone' ? (
          <>
            <label className="block text-xs font-medium text-ink-light mb-1 ml-1 tracking-wide">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
              className="w-full px-4 py-3.5 rounded-btn border border-divider bg-white text-ink placeholder:text-ink-muted
                         focus:outline-none focus-glow transition-shadow text-base"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={phone.length < 11}
              className="w-full py-3.5 rounded-btn bg-primary text-white font-medium text-sm tracking-wide
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              下一步
            </button>
          </>
        ) : (
          <>
            <label className="block text-xs font-medium text-ink-light mb-1 ml-1 tracking-wide">
              密码 · {phone}
              <button onClick={() => setStep('phone')} className="ml-2 text-sky font-normal">修改</button>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3.5 rounded-btn border border-divider bg-white text-ink placeholder:text-ink-muted
                         focus:outline-none focus-glow transition-shadow text-base"
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-3.5 rounded-btn bg-primary text-white font-medium text-sm tracking-wide
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </>
        )}

        {/* 微信登录 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-divider" /></div>
          <div className="relative flex justify-center"><span className="bg-paper px-4 text-xs text-ink-muted">或</span></div>
        </div>

        <button className="w-full py-3.5 rounded-btn border border-divider bg-white text-ink text-sm font-medium tracking-wide
                           hover:bg-paper active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="text-lg">💬</span> 微信一键登录
        </button>
      </div>

      {/* 风格切换 */}
      <div className="max-w-sm mx-auto w-full mt-8 pt-6 border-t border-divider">
        <p className="text-center text-2xs text-ink-muted mb-3">选择界面风格</p>
        <div className="flex justify-center gap-3">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTheme(t.key)}
              className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-btn border transition-all active:scale-95
                ${theme === t.key
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-divider bg-white text-ink-light hover:border-divider-strong'
                }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-2xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-2xs text-ink-muted mt-6 tracking-wide">
        登录即表示同意服务协议和隐私政策
      </p>
    </div>
  )
}
