import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LEAVE_TYPES = ['病假', '事假', '公假']

export default function LeaveFormPage() {
  const navigate = useNavigate()
  const [leaveType, setLeaveType] = useState('病假')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      navigate('/leaves')
    }, 800)
  }

  return (
    <div className="p-4 pb-20">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-light mb-3">← 返回</button>
      <h2 className="font-display text-lg font-bold text-ink mb-4">提交请假申请</h2>

      <div className="space-y-4">
        {/* 请假类型 */}
        <div>
          <label className="block text-xs font-medium text-ink-light mb-2">请假类型</label>
          <div className="flex gap-2">
            {LEAVE_TYPES.map((t) => (
              <button key={t} onClick={() => setLeaveType(t)}
                className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors
                  ${t === leaveType ? 'bg-cat-leave/10 text-cat-leave border border-cat-leave/30' : 'bg-surface text-ink-light border border-divider'}`}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* 日期 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-light mb-1">开始日期</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-btn border border-divider bg-surface text-sm text-ink focus:outline-none focus-glow" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-light mb-1">结束日期</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-btn border border-divider bg-surface text-sm text-ink focus:outline-none focus-glow" />
          </div>
        </div>

        {/* 原因 */}
        <div>
          <label className="block text-xs font-medium text-ink-light mb-1">请假原因</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="请详细描述请假原因"
            rows={4} maxLength={500}
            className="w-full px-3 py-2.5 rounded-btn border border-divider bg-surface text-sm text-ink placeholder:text-ink-light/50 focus:outline-none focus-glow resize-none" />
          <span className="text-2xs text-ink-light">{reason.length}/500</span>
        </div>

        {/* 电话 */}
        <div>
          <label className="block text-xs font-medium text-ink-light mb-1">联系电话</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="紧急联系电话"
            className="w-full px-3 py-2.5 rounded-btn border border-divider bg-surface text-sm text-ink placeholder:text-ink-light/50 focus:outline-none focus-glow" />
        </div>

        <button onClick={handleSubmit} disabled={submitting || !startDate || !endDate || !reason}
          className="w-full py-3.5 rounded-btn bg-primary text-white font-medium text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform">
          {submitting ? '提交中…' : '提交申请'}
        </button>
      </div>
    </div>
  )
}
