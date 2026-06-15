import { Card, Statistic, Tag, Progress, List } from 'antd'
import {
  BookOutlined, TrophyOutlined, CheckSquareOutlined,
  CalendarOutlined, FileTextOutlined, RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { MOCK_EVALUATIONS, MOCK_HONORS, MOCK_TASKS, MOCK_LEAVES, MOCK_ACTIVITIES } from '../../api/mock'

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

  const cards = [
    { title: '最新评语', icon: <BookOutlined />, color: '#1677ff', bg: 'bg-blue-50',
      desc: evals.length > 0 ? evals[0].content.slice(0, 30) + '...' : '暂无', path: '/evaluations' },
    { title: '荣誉奖项', icon: <TrophyOutlined />, color: '#faad14', bg: 'bg-yellow-50',
      desc: `共 ${honors} 项荣誉`, path: '/honors' },
    { title: '待办任务', icon: <CheckSquareOutlined />, color: pending > 0 ? '#ff4d4f' : '#52c41a', bg: pending > 0 ? 'bg-red-50' : 'bg-green-50',
      desc: pending > 0 ? `${pending} 项待完成` : '全部完成 ✅', path: '/tasks' },
    { title: '请假审批', icon: <FileTextOutlined />, color: pendingLeaves > 0 ? '#faad14' : '#52c41a', bg: pendingLeaves > 0 ? 'bg-yellow-50' : 'bg-green-50',
      desc: pendingLeaves > 0 ? `${pendingLeaves} 条待审批` : '无待审批', path: '/leaves' },
  ]

  return (
    <div className="p-4 pb-20">
      {/* 欢迎 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">{currentStudent?.name}的校园动态</h2>
        <p className="text-xs text-gray-400">{currentStudent?.className} · 2025-2026学年第二学期</p>
      </div>

      {/* 快速入口卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {cards.map((c, i) => (
          <Card
            key={i}
            size="small"
            className={`${c.bg} border-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
            onClick={() => navigate(c.path)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: c.color, fontSize: 18 }}>{c.icon}</span>
              <span className="text-sm font-medium">{c.title}</span>
            </div>
            <p className="text-xs text-gray-500">{c.desc}</p>
          </Card>
        ))}
      </div>

      {/* 任务进度 */}
      {tasks.length > 0 && (
        <Card size="small" className="mb-4 shadow-sm" title="任务进度">
          <Progress
            percent={Math.round(((tasks.length - pending) / tasks.length) * 100)}
            format={() => `${tasks.length - pending}/${tasks.length} 完成`}
          />
          <div className="mt-2 space-y-1">
            {tasks.filter((t) => t.status !== '已完成').slice(0, 2).map((t) => (
              <div key={t.id} className="flex justify-between text-xs text-gray-500">
                <span>· {t.title}</span>
                <Tag color="red" className="text-xs">截止 {t.dueDate}</Tag>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 最新评语 */}
      {evals.length > 0 && (
        <Card size="small" className="mb-4 shadow-sm" title="最新评语">
          {evals.map((e) => (
            <div key={e.id} className="mb-2 pb-2 border-b last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <Tag color="blue">{e.subject}</Tag>
                <span className="text-xs font-medium">{e.teacherName}</span>
                <span className="text-xs text-gray-400">{e.createdAt}</span>
              </div>
              <p className="text-xs text-gray-600">{e.content.slice(0, 50)}...</p>
            </div>
          ))}
          <div
            className="text-center text-xs text-blue-500 cursor-pointer mt-2"
            onClick={() => navigate('/evaluations')}
          >
            查看全部 <RightOutlined />
          </div>
        </Card>
      )}

      {/* 近期活动 */}
      {activities.length > 0 && (
        <Card size="small" className="mb-4 shadow-sm" title={<><CalendarOutlined className="mr-1" />近期活动</>}>
          {activities.slice(0, 2).map((a) => (
            <div key={a.id} className="flex justify-between items-center py-1">
              <div>
                <div className="text-sm">{a.title}</div>
                <div className="text-xs text-gray-400">{a.startTime.slice(0, 10)} · {a.location}</div>
              </div>
              <Tag color="green">{a.status}</Tag>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
