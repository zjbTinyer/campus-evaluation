import { useState } from 'react'
import { MOCK_ACTIVITIES } from '../../api/mock'
import { ActivityIcon, ClockIcon, LocationIcon, UsersIcon, CheckIcon } from '../../components/icons'

const TABS = ['全部', '报名中', '进行中', '已结束']
const TYPE_CLASS: Record<string, string> = {
  '文体活动': 'tag-activity', '家长会': 'text-cat-leave bg-cat-leave/10', '开放日': 'tag-task',
  '讲座': 'tag-eval', '比赛': 'text-accent bg-accent/10', '社会实践': 'text-gold bg-gold/10',
}

export default function ActivitiesPage() {
  const [tab, setTab] = useState('全部')
  const [registering, setRegistering] = useState<number | null>(null)

  const records = MOCK_ACTIVITIES.filter((a) => tab === '全部' || a.status === tab)

  const handleRegister = (id: number) => {
    setRegistering(id)
    setTimeout(() => setRegistering(null), 600)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-fg mb-3">学校活动</h2>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
              ${t === tab
                ? 'bg-primary/15 text-primary border border-primary/30 shadow-glow-sm'
                : 'bg-surface text-fg-muted border border-divider hover:border-border-light'
              }`}
          >{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {records.map((a) => (
          <div key={a.id} className="border-activity rounded-card bg-surface shadow-card card-enter card-hover overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <ActivityIcon size={16} className="text-fg-muted flex-shrink-0" />
                <h3 className="text-sm font-medium text-fg flex-1">{a.title}</h3>
                <span className={`text-2xs px-2 py-0.5 rounded-full ${TYPE_CLASS[a.activityType] || ''}`}>
                  {a.activityType}
                </span>
                <span className={`text-2xs px-2 py-0.5 rounded-full ${
                  a.status === '报名中' ? 'tag-eval' : a.status === '进行中' ? 'tag-task' : 'bg-bg-elevated text-fg-muted'}`}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-fg-muted mb-2 line-clamp-2">{a.description}</p>
              <div className="text-2xs text-fg-muted space-y-0.5 mb-3">
                <div className="flex items-center gap-1"><ClockIcon size={10} /> {a.startTime} ~ {a.endTime.slice(11)}</div>
                {a.location && <div className="flex items-center gap-1"><LocationIcon size={10} /> {a.location}</div>}
                {a.maxParticipants > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><UsersIcon size={10} /> {a.currentCount}/{a.maxParticipants} 人</span>
                    <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden max-w-24">
                      <div className="h-full bg-secondary rounded-full shadow-glow-sm"
                        style={{ width: `${Math.round((a.currentCount / a.maxParticipants) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
              {a.status === '报名中' && (
                <button onClick={() => handleRegister(a.id)}
                  className="w-full py-2 rounded-btn bg-primary text-bg text-xs font-medium
                             active:scale-[0.98] transition-all disabled:opacity-50 shadow-glow-sm
                             hover:shadow-glow-md flex items-center justify-center gap-1"
                  disabled={registering === a.id}>
                  {registering === a.id ? (
                    <><CheckIcon size={12} /> 已报名</>
                  ) : a.registrationDeadline ? `立即报名（截止${a.registrationDeadline.slice(5)}）` : '立即报名'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
