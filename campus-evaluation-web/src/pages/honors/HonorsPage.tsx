import { MOCK_HONORS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { HonorIcon, CheckIcon } from '../../components/icons'

const LEVEL_CLASS: Record<string, string> = {
  '国家级': 'bg-accent/15 text-accent', '省级': 'bg-cat-leave/15 text-cat-leave',
  '市级': 'bg-secondary/15 text-secondary', '区级': 'bg-primary/15 text-primary', '校级': 'bg-gold/15 text-gold',
}

export default function HonorsPage() {
  const { currentStudent } = useCurrentStudent()
  const records = MOCK_HONORS.filter((h) => h.studentId === currentStudent?.id)

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-fg mb-3">荣誉墙</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="tag-honor text-2xs px-2 py-0.5 rounded-full">共 {records.length} 项</span>
      </div>

      <div className="space-y-3">
        {records.map((h) => (
          <div key={h.id} className="border-honor rounded-card bg-surface p-3 shadow-card card-enter card-hover flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0 border border-divider">
              <HonorIcon size={18} className="text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-fg">{h.name}</h3>
                <span className={`text-2xs px-1.5 py-0.5 rounded-full ${LEVEL_CLASS[h.honorLevel] || 'bg-bg-elevated text-fg-muted'}`}>
                  {h.honorLevel}
                </span>
              </div>
              <div className="text-2xs text-fg-muted space-y-0.5">
                <div className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                  {h.grantOrg}
                </div>
                <div className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {h.grantDate}
                </div>
              </div>
            </div>
            <CheckIcon size={18} className="text-gold flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
