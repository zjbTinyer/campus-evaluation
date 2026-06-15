import { Card, Tag, Button, Empty, Segmented } from 'antd'
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MOCK_LEAVES } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const STATUS_TABS = ['全部', '待审批', '已批准', '已驳回']

const STATUS_COLORS: Record<string, string> = {
  '待审批': 'orange', '已批准': 'green', '已驳回': 'red', '已撤销': 'default',
}

export default function LeavesPage() {
  const navigate = useNavigate()
  const { currentStudent } = useCurrentStudent()
  const [status, setStatus] = useState('全部')

  const records = MOCK_LEAVES
    .filter((l) => l.studentId === currentStudent?.id)
    .filter((l) => status === '全部' || l.status === status)

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">请假记录</h2>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => navigate('/leaves/new')}>
          提交请假
        </Button>
      </div>

      <Segmented
        options={STATUS_TABS}
        value={status}
        onChange={(v) => setStatus(v as string)}
        className="mb-4"
        block
      />

      {records.length === 0 ? (
        <Empty description="暂无请假记录">
          <Button type="primary" onClick={() => navigate('/leaves/new')}>提交请假</Button>
        </Empty>
      ) : (
        <div className="space-y-3">
          {records.map((l) => (
            <Card key={l.id} size="small" className="shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Tag color={l.leaveType === '病假' ? 'red' : l.leaveType === '事假' ? 'blue' : 'purple'}>
                    {l.leaveType}
                  </Tag>
                  <span className="text-sm font-medium ml-2">
                    {l.startDate} ~ {l.endDate}
                  </span>
                </div>
                <Tag color={STATUS_COLORS[l.status]}>{l.status}</Tag>
              </div>

              <p className="text-sm text-gray-600 mb-1">原因：{l.reason}</p>

              {l.approveRemark && (
                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                  审批意见：{l.approveRemark}
                </p>
              )}

              <div className="text-xs text-gray-400 mt-2">
                <ClockCircleOutlined className="mr-1" />提交于 {l.createdAt}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
