import { useState } from 'react'
import { MOCK_TASKS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const TABS = ['全部', '待完成', '已完成', '已逾期']

export default function TasksPage() {
  const { currentStudent } = useCurrentStudent()
  const [tab, setTab] = useState('全部')
  const [checkingIn, setCheckingIn] = useState<number | null>(null)

  const records = MOCK_TASKS
    .filter((t) => t.studentId === currentStudent?.id)
    .filter((t) => tab === '全部' || t.status === tab)

  const all = MOCK_TASKS.filter((t) => t.studentId === currentStudent?.id)
  const completed = all.filter((t) => t.status === '已完成').length

  const handleCheckin = (id: number) => {
    setCheckingIn(id)
    setTimeout(() => setCheckingIn(null), 800)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-ink mb-3">任务打卡</h2>

      {/* 进度 */}
      <div className="mb-4 px-4 py-3 rounded-card bg-surface border border-divider">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ink-light">完成进度</span>
          <span className="font-bold text-ink">{completed}/{all.length}</span>
        </div>
        <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${all.length > 0 ? Math.round((completed / all.length) * 100) : 0}%` }} />
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0
              ${t === tab ? 'bg-sky/10 text-sky border border-sky/30' : 'bg-surface text-ink-light border border-divider'}`}
          >{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {records.map((t) => (
          <div key={t.id} className={`border-task rounded-card bg-surface p-3 shadow-card card-enter ${t.status === '已逾期' ? 'ring-1 ring-seal/30' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-ink">{t.title}</h3>
                  <span className={`text-2xs px-1.5 py-0.5 rounded-full
                    ${t.status === '已完成' ? 'tag-eval' : t.status === '已逾期' ? 'text-seal bg-seal/10' : 'tag-task'}`}>
                    {t.status}
                  </span>
                </div>
                {t.description && <p className="text-xs text-ink-light mt-0.5">{t.description}</p>}
              </div>
              {t.status !== '已完成' ? (
                <button onClick={() => handleCheckin(t.id)}
                  className={`flex-shrink-0 ml-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-90
                    ${checkingIn === t.id ? 'bg-paper text-ink-light' : 'bg-sky text-white'}`}>
                  {checkingIn === t.id ? '✓ 已打卡' : '打卡'}
                </button>
              ) : (
                <span className="text-primary font-bold flex-shrink-0 ml-3">✓</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-2xs text-ink-light">
              <span>⏰ 截止 {t.dueDate}</span>
              <span>进度 {t.checkinCount}/{t.totalCount}</span>
              {t.repeatType !== '一次性' && <span className="tag-task px-1.5 py-0.5 rounded-full">{t.repeatType}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
