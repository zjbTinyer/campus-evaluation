import { useState } from 'react'
import { Card, Tag, Button, Progress, Segmented, Empty, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { MOCK_TASKS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const STATUS_TABS = ['全部', '待完成', '已完成', '已逾期']

export default function TasksPage() {
  const { currentStudent } = useCurrentStudent()
  const [status, setStatus] = useState('全部')
  const [checkingIn, setCheckingIn] = useState<number | null>(null)

  const records = MOCK_TASKS
    .filter((t) => t.studentId === currentStudent?.id)
    .filter((t) => status === '全部' || t.status === status)

  const completed = MOCK_TASKS.filter((t) => t.studentId === currentStudent?.id && t.status === '已完成').length
  const total = MOCK_TASKS.filter((t) => t.studentId === currentStudent?.id).length

  const handleCheckin = (taskId: number, title: string) => {
    setCheckingIn(taskId)
    setTimeout(() => {
      message.success(`「${title}」打卡成功！`)
      setCheckingIn(null)
    }, 800)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-lg font-bold mb-3">任务打卡</h2>

      {/* 完成进度 */}
      <Card size="small" className="mb-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">完成进度</div>
            <div className="text-xs text-gray-500">{completed}/{total} 项已完成</div>
          </div>
          <Progress type="circle" percent={total > 0 ? Math.round((completed / total) * 100) : 0} size={48} />
        </div>
      </Card>

      <Segmented
        options={STATUS_TABS}
        value={status}
        onChange={(v) => setStatus(v as string)}
        className="mb-4"
        block
      />

      {records.length === 0 ? (
        <Empty description="暂无任务" />
      ) : (
        <div className="space-y-3">
          {records.map((t) => (
            <Card key={t.id} size="small" className={`shadow-sm ${t.status === '已逾期' ? 'border-red-300 bg-red-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{t.title}</h3>
                    <Tag color={t.status === '已完成' ? 'green' : t.status === '已逾期' ? 'red' : 'blue'}>
                      {t.status}
                    </Tag>
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-500 mb-1">{t.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span><ClockCircleOutlined className="mr-1" />截止 {t.dueDate}</span>
                    <span>进度 {t.checkinCount}/{t.totalCount}</span>
                    {t.repeatType && t.repeatType !== '一次性' && (
                      <Tag className="text-xs">{t.repeatType}</Tag>
                    )}
                  </div>
                </div>

                {t.status !== '已完成' && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    loading={checkingIn === t.id}
                    onClick={() => handleCheckin(t.id, t.title)}
                  >
                    打卡
                  </Button>
                )}
                {t.status === '已完成' && (
                  <CheckCircleOutlined className="text-green-500 text-xl" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
