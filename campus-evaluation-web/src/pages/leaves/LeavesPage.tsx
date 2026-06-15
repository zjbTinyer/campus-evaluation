import { Typography, Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function LeavesPage() {
  const navigate = useNavigate()

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4} className="mb-0">请假记录</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/leaves/new')}
        >
          提交请假
        </Button>
      </div>
      <Empty description="暂无请假记录" />
    </div>
  )
}
