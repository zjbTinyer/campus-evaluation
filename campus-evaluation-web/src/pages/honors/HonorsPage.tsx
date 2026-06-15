import { Card, Tag, Empty } from 'antd'
import { TrophyOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { MOCK_HONORS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const LEVEL_COLORS: Record<string, string> = {
  '国家级': 'red', '省级': 'orange', '市级': 'blue', '区级': 'cyan', '校级': 'green',
}
const CAT_ICONS: Record<string, string> = {
  '竞赛': '🏆', '品德': '🌟', '体育': '⚽', '艺术': '🎨', '学习': '📚', '其他': '🎖️',
}

export default function HonorsPage() {
  const { currentStudent } = useCurrentStudent()

  const records = MOCK_HONORS.filter((h) => h.studentId === currentStudent?.id)
  const categories = [...new Set(records.map((h) => h.category))]

  return (
    <div className="p-4 pb-20">
      <h2 className="text-lg font-bold mb-3">荣誉墙</h2>

      {/* 分类统计 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag color="blue">共 {records.length} 项荣誉</Tag>
        {categories.map((c) => (
          <Tag key={c}>{CAT_ICONS[c] || ''} {c}: {records.filter((h) => h.category === c).length}</Tag>
        ))}
      </div>

      {records.length === 0 ? (
        <Empty description="暂无荣誉记录" />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {records.map((h) => (
            <Card key={h.id} size="small" className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{CAT_ICONS[h.category] || '🎖️'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{h.name}</h3>
                    <Tag color={LEVEL_COLORS[h.honorLevel] || 'default'} className="text-xs">
                      {h.honorLevel}
                    </Tag>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div><EnvironmentOutlined className="mr-1" />{h.grantOrg}</div>
                    <div><CalendarOutlined className="mr-1" />{h.grantDate}</div>
                  </div>
                </div>
                <TrophyOutlined className="text-yellow-500 text-xl" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
