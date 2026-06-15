import { Card, Tag, Progress, Statistic, Empty } from 'antd'
import { TrophyOutlined, PercentageOutlined, OrderedListOutlined } from '@ant-design/icons'
import { MOCK_ARCHIVES } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

export default function ArchivesPage() {
  const { currentStudent } = useCurrentStudent()

  const records = MOCK_ARCHIVES.filter((a) => a.studentId === currentStudent?.id)

  return (
    <div className="p-4 pb-20">
      <h2 className="text-lg font-bold mb-3">历史档案</h2>

      {records.length === 0 ? (
        <Empty description="暂无档案记录" />
      ) : (
        <div className="space-y-4">
          {records.map((a) => (
            <Card key={a.id} className="shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{a.semesterName}</h3>
                <Tag color="blue">{a.archiveType}</Tag>
              </div>

              {/* 核心指标 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card size="small" className="text-center bg-blue-50">
                  <Statistic
                    title="平均分"
                    value={a.totalScore}
                    suffix="分"
                    valueStyle={{ fontSize: 18, color: '#1677ff' }}
                  />
                </Card>
                <Card size="small" className="text-center bg-green-50">
                  <Statistic
                    title="出勤率"
                    value={a.attendanceRate}
                    suffix="%"
                    valueStyle={{ fontSize: 18, color: '#52c41a' }}
                  />
                </Card>
                <Card size="small" className="text-center bg-orange-50">
                  <Statistic
                    title="班级排名"
                    value={a.rank}
                    suffix="名"
                    valueStyle={{ fontSize: 18, color: '#faad14' }}
                  />
                </Card>
              </div>

              {/* 综合评价 */}
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <h4 className="text-sm font-medium mb-1">综合评价</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{a.summary}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span><TrophyOutlined className="mr-1" />数学英语表现突出</span>
                <span><PercentageOutlined className="mr-1" />全勤率 {a.attendanceRate}%</span>
                <span><OrderedListOutlined className="mr-1" />前 {Math.round((a.rank || 0) / 42 * 100)}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
