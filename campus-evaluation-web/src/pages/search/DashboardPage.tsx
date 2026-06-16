import { useNavigate } from 'react-router-dom'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { MOCK_EVALUATIONS, MOCK_HONORS, MOCK_TASKS, MOCK_LEAVES, MOCK_ACTIVITIES } from '../../api/mock'
import {
  EvaluationIcon, HonorIcon, TaskIcon, LeaveIcon,
  ChevronRight,
} from '../../components/icons'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { currentStudent } = useCurrentStudent()
  const sid = currentStudent?.id || '1'

  const evals = MOCK_EVALUATIONS.filter((e) => e.studentId === sid).slice(0, 2)
  const honors = MOCK_HONORS.filter((h) => h.studentId === sid).length
  const tasks = MOCK_TASKS.filter((t) => t.studentId === sid)
  const pending = tasks.filter((t) => t.status !== '已完成').length
  const pendingLeaves = MOCK_LEAVES.filter((l) => l.studentId === sid && l.status === '待审批').length
  const activities = MOCK_ACTIVITIES.filter((a) => a.status === '报名中')

  return (
    <div className="p-4 pb-20">
      <h2 className="font-display text-lg font-bold text-fg mb-1">{currentStudent?.name}的校园动态</h2>
      <p className="text-xs text-fg-muted mb-5">{currentStudent?.className} · 2025-2026学年第二学期</p>

      {/* 快速入口 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <DashCard
          Icon={EvaluationIcon} label="最新评语"
          desc={evals.length > 0 ? evals[0].content.slice(0, 20) + '…' : '暂无'}
          onClick={() => navigate('/evaluations')}
        />
        <DashCard
          Icon={HonorIcon} label="荣誉奖项"
          desc={`共 ${honors} 项`}
          onClick={() => navigate('/honors')}
        />
        <DashCard
          Icon={TaskIcon} label="待办任务"
          desc={pending > 0 ? `${pending} 项` : '全部完成 ✓'}
          accent={pending > 0}
          onClick={() => navigate('/tasks')}
        />
        <DashCard
          Icon={LeaveIcon} label="请假审批"
          desc={pendingLeaves > 0 ? `${pendingLeaves} 条待审` : '暂无'}
          accent={pendingLeaves > 0}
          onClick={() => navigate('/leaves')}
        />
      </div>

      {/* 任务进度条 */}
      {tasks.length > 0 && (
        <div className="mb-5 px-4 py-3 rounded-card bg-surface border border-divider">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-fg-muted">任务进度</span>
            <span className="font-medium text-fg font-mono">{tasks.length - pending}/{tasks.length} 完成</span>
          </div>
          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 shadow-glow-sm"
              style={{ width: `${Math.round(((tasks.length - pending) / tasks.length) * 100)}%` }}
            />
          </div>
          {pending > 0 && (
            <div className="mt-2 space-y-1">
              {tasks.filter((t) => t.status !== '已完成').slice(0, 2).map((t) => (
                <div key={t.id} className="flex justify-between text-xs">
                  <span className="text-fg-muted">· {t.title}</span>
                  <span className="text-accent">截止 {t.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 最近评语 */}
      {evals.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-fg mb-2">最新评语</h3>
          {evals.map((e) => (
            <div key={e.id} className="border-eval rounded-card bg-surface p-3 mb-2 shadow-card card-hover">
              <div className="flex items-center gap-2 mb-1">
                <span className="tag-eval text-2xs px-2 py-0.5 rounded-full">{e.subject}</span>
                <span className="text-xs font-medium text-fg">{e.teacherName}</span>
                <span className="text-2xs text-fg-muted ml-auto">{e.createdAt}</span>
              </div>
              <p className="text-xs text-fg-muted leading-relaxed">{e.content.slice(0, 60)}…</p>
            </div>
          ))}
          <button onClick={() => navigate('/evaluations')} className="text-xs text-secondary mt-1 flex items-center gap-1">
            查看全部 <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* 近期活动 */}
      {activities.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-fg mb-2">近期活动</h3>
          {activities.slice(0, 2).map((a) => (
            <div key={a.id} className="border-activity rounded-card bg-surface p-3 mb-2 shadow-card card-hover flex justify-between items-center">
              <div>
                <div className="text-sm text-fg">{a.title}</div>
                <div className="text-2xs text-fg-muted">{a.startTime.slice(0, 10)} · {a.location}</div>
              </div>
              <span className="tag-activity text-2xs px-2 py-0.5 rounded-full">{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DashCard({ Icon, label, desc, accent, onClick }: {
  Icon: typeof EvaluationIcon; label: string; desc: string; accent?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-card bg-surface border border-divider shadow-card
                  card-hover transition-all active:scale-[0.97]
                  ${accent ? 'ring-1 ring-primary/30' : ''}`}
    >
      <Icon size={22} className="text-fg-muted mb-1" />
      <div className="text-sm font-medium text-fg mt-1">{label}</div>
      <div className={`text-2xs mt-0.5 ${accent ? 'text-accent font-medium' : 'text-fg-muted'}`}>{desc}</div>
    </button>
  )
}
