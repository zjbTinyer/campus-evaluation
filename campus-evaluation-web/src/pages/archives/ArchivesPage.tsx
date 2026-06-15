import { Typography, Empty } from 'antd'

export default function ArchivesPage() {
  return (
    <div className="p-4">
      <Typography.Title level={4}>历史档案</Typography.Title>
      <Empty description="暂无档案记录" />
    </div>
  )
}
