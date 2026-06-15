import { Typography, Empty } from 'antd'

export default function HonorsPage() {
  return (
    <div className="p-4">
      <Typography.Title level={4}>荣誉墙</Typography.Title>
      <Empty description="暂无荣誉记录" />
    </div>
  )
}
