import { MOCK_HONORS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const LEVEL_CLASS: Record<string, string> = {
  '国家级': 'bg-vermilion/10 text-vermilion', '省级': 'bg-orchid/10 text-orchid',
  '市级': 'bg-calm/10 text-calm', '区级': 'bg-moss/10 text-moss', '校级': 'bg-gold/10 text-gold',
}
const CAT_ICONS: Record<string, string> = {
  '竞赛': '🏆', '品德': '🌟', '体育': '⚽', '艺术': '🎨', '学习': '📚', '其他': '🎖️',
}

export default function HonorsPage() {
  const { currentStudent } = useCurrentStudent()
  const records = MOCK_HONORS.filter((h) => h.studentId === currentStudent?.id)

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-ink mb-3">荣誉墙</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="tag-honor text-2xs px-2 py-0.5 rounded-full">共 {records.length} 项</span>
      </div>

      <div className="space-y-3">
        {records.map((h) => (
          <div key={h.id} className="border-honor rounded-card bg-surface p-3 shadow-card card-enter flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{CAT_ICONS[h.category] || '🎖️'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-ink">{h.name}</h3>
                <span className={`text-2xs px-1.5 py-0.5 rounded-full ${LEVEL_CLASS[h.honorLevel] || 'bg-paper text-ink-light'}`}>
                  {h.honorLevel}
                </span>
              </div>
              <div className="text-2xs text-ink-light space-y-0.5">
                <div>📍 {h.grantOrg}</div>
                <div>📅 {h.grantDate}</div>
              </div>
            </div>
            <span className="text-gold text-lg flex-shrink-0">🏅</span>
          </div>
        ))}
      </div>
    </div>
  )
}
