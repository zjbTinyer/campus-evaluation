import { useState } from 'react'
import { MOCK_EVALUATIONS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const SUBJECTS = ['全部', '数学', '语文', '英语']

export default function EvaluationsPage() {
  const { currentStudent } = useCurrentStudent()
  const [subject, setSubject] = useState('全部')

  const records = MOCK_EVALUATIONS
    .filter((e) => e.studentId === currentStudent?.id)
    .filter((e) => subject === '全部' || e.subject === subject)

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-ink mb-3">教师评语</h2>

      {/* 科目筛选 */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {SUBJECTS.map((s) => (
          <button key={s} onClick={() => setSubject(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0
              ${s === subject ? 'bg-primary-light text-primary border border-primary/30' : 'bg-surface text-ink-light border border-divider'}`}
          >{s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {records.map((e) => (
          <div key={e.id} className="border-eval rounded-card bg-surface p-3 shadow-card card-enter">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-paper flex items-center justify-center text-xs font-display text-ink-light">
                {e.teacherName[0]}
              </span>
              <span className="text-sm font-medium text-ink">{e.teacherName}</span>
              <span className="tag-eval text-2xs px-2 py-0.5 rounded-full">{e.subject} · {e.evaluationType}</span>
            </div>
            <p className="text-sm text-ink-light leading-relaxed mb-2">{e.content}</p>
            <div className="flex items-center justify-between text-2xs text-ink-light">
              <span>{e.createdAt}</span>
              {e.score && (
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < e.score! ? 'text-gold' : 'text-divider'}>★</span>
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-2xs text-ink-light mt-4">共 {records.length} 条评语</p>
    </div>
  )
}
