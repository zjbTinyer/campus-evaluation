import { MOCK_ARCHIVES } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

export default function ArchivesPage() {
  const { currentStudent } = useCurrentStudent()
  const records = MOCK_ARCHIVES.filter((a) => a.studentId === currentStudent?.id)

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-ink mb-3">历史档案</h2>

      <div className="space-y-4">
        {records.map((a) => (
          <div key={a.id} className="rounded-card bg-surface border border-divider shadow-card card-enter overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-ink">{a.semesterName}</h3>
                <span className="tag-eval text-2xs px-2 py-0.5 rounded-full">{a.archiveType}</span>
              </div>

              {/* 指标 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center px-2 py-3 rounded-card bg-moss/5">
                  <div className="font-number text-xl font-bold text-moss">{a.totalScore}</div>
                  <div className="text-2xs text-ink-light mt-0.5">平均分</div>
                </div>
                <div className="text-center px-2 py-3 rounded-card bg-gold/5">
                  <div className="font-number text-xl font-bold text-gold">{a.attendanceRate}%</div>
                  <div className="text-2xs text-ink-light mt-0.5">出勤率</div>
                </div>
                <div className="text-center px-2 py-3 rounded-card bg-calm/5">
                  <div className="font-number text-xl font-bold text-calm">#{a.rank}</div>
                  <div className="text-2xs text-ink-light mt-0.5">班级排名</div>
                </div>
              </div>

              {/* 综合评价 */}
              <div className="bg-paper p-3 rounded-card">
                <h4 className="text-xs font-medium text-ink mb-1">综合评价</h4>
                <p className="text-sm text-ink-light leading-relaxed">{a.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
