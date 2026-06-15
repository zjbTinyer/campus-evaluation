import { Typography, Tabs, Empty } from 'antd'

export default function TasksPage() {
  return (
    <div className="p-4">
      <Typography.Title level={4}>任务打卡</Typography.Title>
      <Tabs
        items={['待完成', '已完成', '已逾期', '全部'].map((tab) => ({
          key: tab,
          label: tab,
          children: <Empty description="暂无任务" />,
        }))}
      />
    </div>
  )
}
