import { useState } from 'react'
import { Card, Tag, Button, Segmented, Empty, message, Progress } from 'antd'
import { EnvironmentOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { MOCK_ACTIVITIES } from '../../api/mock'

const TYPE_COLORS: Record<string, string> = {
  '文体活动': 'blue', '家长会': 'purple', '开放日': 'cyan',
  '讲座': 'orange', '比赛': 'red', '社会实践': 'green', '其他': 'default',
}

export default function ActivitiesPage() {
  const [status, setStatus] = useState('全部')
  const [registering, setRegistering] = useState<number | null>(null)

  const records = MOCK_ACTIVITIES.filter((a) => status === '全部' || a.status === status)

  const handleRegister = (id: number, title: string) => {
    setRegistering(id)
    setTimeout(() => {
      message.success(`已报名「${title}」`)
      setRegistering(null)
    }, 600)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-lg font-bold mb-3">学校活动</h2>

      <Segmented
        options={['全部', '报名中', '进行中', '已结束']}
        value={status}
        onChange={(v) => setStatus(v as string)}
        className="mb-4"
        block
      />

      {records.length === 0 ? (
        <Empty description="暂无活动" />
      ) : (
        <div className="space-y-3">
          {records.map((a) => (
            <Card key={a.id} size="small" className="shadow-sm">
              {/* 标题和类型 */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm flex-1">{a.title}</h3>
                <Tag color={TYPE_COLORS[a.activityType] || 'default'}>{a.activityType}</Tag>
                <Tag color={a.status === '报名中' ? 'green' : a.status === '进行中' ? 'blue' : 'default'}>
                  {a.status}
                </Tag>
              </div>

              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{a.description}</p>

              {/* 详情 */}
              <div className="text-xs text-gray-400 space-y-1 mb-3">
                <div><ClockCircleOutlined className="mr-1" />{a.startTime} ~ {a.endTime.slice(11)}</div>
                {a.location && <div><EnvironmentOutlined className="mr-1" />{a.location}</div>}
                {a.maxParticipants > 0 && (
                  <div>
                    <TeamOutlined className="mr-1" />
                    {a.currentCount}/{a.maxParticipants} 人
                    <Progress
                      percent={Math.round((a.currentCount / a.maxParticipants) * 100)}
                      size="small"
                      className="inline-block w-20 ml-2"
                      showInfo={false}
                    />
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              {a.status === '报名中' && (
                <Button
                  type="primary"
                  size="small"
                  block
                  loading={registering === a.id}
                  onClick={() => handleRegister(a.id, a.title)}
                >
                  {a.registrationDeadline
                    ? `立即报名（截止${a.registrationDeadline.slice(5)}）`
                    : '立即报名'}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
