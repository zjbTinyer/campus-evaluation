import { Typography, Empty } from 'antd'

/**
 * 评语列表页 — 从搜索结果导航进入，展示筛选+时间线
 */
export default function EvaluationsPage() {
  return (
    <div className="p-4">
      <Typography.Title level={4}>教师评语</Typography.Title>
      <Empty description="暂无评语数据" />
    </div>
  )
}
