import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'password'>('phone')
  const { login } = useAuth()

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
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🏫</div>
        <h1 className="font-display text-hero font-bold text-ink mb-2">
          校园评价
        </h1>
        <p className="font-body text-sm text-ink-light">
          关注孩子每一步成长
        </p>
      </div>

      {/* 登录表单 */}
      <div className="max-w-sm mx-auto w-full space-y-4">
        {step === 'phone' ? (
          <>
            <label className="block text-xs font-medium text-ink-light mb-1">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
              className="w-full px-4 py-3.5 rounded-btn border border-divider bg-surface text-ink placeholder:text-ink-light/50 focus:outline-none search-glow transition-shadow text-base"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={phone.length < 11}
              className="w-full py-3.5 rounded-btn bg-vermilion text-white font-medium text-sm
                         disabled:opacity-40 disabled:cursor-not-allowed
                         active:scale-[0.98] transition-transform"
            >
              下一步
            </button>
          </>
        ) : (
          <>
            <label className="block text-xs font-medium text-ink-light mb-1">
              密码 · {phone}
              <button onClick={() => setStep('phone')} className="ml-2 text-calm underline">修改</button>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3.5 rounded-btn border border-divider bg-surface text-ink placeholder:text-ink-light/50 focus:outline-none search-glow transition-shadow text-base"
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-3.5 rounded-btn bg-vermilion text-white font-medium text-sm
                         disabled:opacity-40 disabled:cursor-not-allowed
                         active:scale-[0.98] transition-transform"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </>
        )}

        {/* 微信登录 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-divider" /></div>
          <div className="relative flex justify-center"><span className="bg-paper px-4 text-xs text-ink-light">或</span></div>
        </div>

        <button className="w-full py-3.5 rounded-btn border border-divider bg-surface text-ink text-sm font-medium
                           active:bg-paper transition-colors flex items-center justify-center gap-2">
          <span className="text-lg">💬</span> 微信一键登录
        </button>
      </div>

      <p className="text-center text-2xs text-ink-light mt-8">
        登录即表示同意服务协议和隐私政策
      </p>
    </div>
  )
}
