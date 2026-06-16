import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_LEAVES } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { LeaveIcon, PlusIcon } from '../../components/icons'

const TABS = ['全部', '待审批', '已批准', '已驳回']
const STATUS_CLASS: Record<string, string> = {
  '待审批': 'text-gold bg-gold/15', '已批准': 'tag-eval', '已驳回': 'text-accent bg-accent/10',
}

export default function LeavesPage() {
  const navigate = useNavigate()
  const { currentStudent } = useCurrentStudent()
  const [tab, setTab] = useState('全部')

  const records = MOCK_LEAVES
    .filter((l) => l.studentId === currentStudent?.id)
    .filter((l) => tab === '全部' || l.status === tab)

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-display text-lg font-bold text-fg">请假记录</h2>
        <button onClick={() => navigate('/leaves/new')}
          className="px-3 py-1.5 rounded-full bg-primary text-bg text-xs font-medium
                     active:scale-95 transition-transform shadow-glow-sm flex items-center gap-1">
          <PlusIcon size={12} /> 提交请假
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
              ${t === tab
                ? 'bg-cat-leave/15 text-cat-leave border border-cat-leave/30'
                : 'bg-surface text-fg-muted border border-divider hover:border-border-light'
              }`}
          >{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {records.map((l) => (
          <div key={l.id} className="border-leave rounded-card bg-surface p-3 shadow-card card-enter card-hover">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xs px-2 py-0.5 rounded-full
                  ${l.leaveType === '病假' ? 'text-accent bg-accent/10'
                    : l.leaveType === '事假' ? 'tag-task'
                    : 'text-cat-leave bg-cat-leave/10'}`}>
                  {l.leaveType}
                </span>
                <span className="text-sm font-medium text-fg">{l.startDate} ~ {l.endDate}</span>
              </div>
              <span className={`text-2xs px-2 py-0.5 rounded-full ${STATUS_CLASS[l.status] || ''}`}>{l.status}</span>
            </div>
            <p className="text-sm text-fg-muted mb-1">原因：{l.reason}</p>
            {l.approveRemark && (
              <div className="mt-2 px-3 py-2 bg-bg-elevated rounded-btn text-xs text-fg-muted">审批意见：{l.approveRemark}</div>
            )}
            <div className="text-2xs text-fg-muted mt-2">提交于 {l.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
