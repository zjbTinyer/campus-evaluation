import { Typography, Empty, Segmented } from 'antd'
import { useState } from 'react'

export default function ActivitiesPage() {
  const [status, setStatus] = useState('报名中')

  return (
    <div className="p-4">
      <Typography.Title level={4}>学校活动</Typography.Title>
      <Segmented
        options={['报名中', '进行中', '已结束']}
        value={status}
        onChange={(v) => setStatus(v as string)}
        block
        className="mb-4"
      />
      <Empty description="暂无活动" />
    </div>
  )
}
