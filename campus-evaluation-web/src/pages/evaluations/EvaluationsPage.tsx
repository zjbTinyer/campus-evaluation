import { useState } from 'react'
import { Card, Tag, Rate, Segmented, Empty } from 'antd'
import { UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { MOCK_EVALUATIONS } from '../../api/mock'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

const SUBJECTS = ['全部', '数学', '语文', '英语']

export default function EvaluationsPage() {
  const { currentStudent } = useCurrentStudent()
  const [subject, setSubject] = useState('全部')

  const records = MOCK_EVALUATIONS
    .filter((e) => e.studentId === currentStudent?.id)
    .filter((e) => subject === '全部' || e.subject === subject)

  return (
    <div className="p-4 pb-20">
      <h2 className="text-lg font-bold mb-3">教师评语</h2>

      <Segmented
        options={SUBJECTS}
        value={subject}
        onChange={(v) => setSubject(v as string)}
        className="mb-4"
        block
      />

      {records.length === 0 ? (
        <Empty description="暂无评语" />
      ) : (
        <div className="space-y-3">
          {records.map((e) => (
            <Card key={e.id} size="small" className="shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserOutlined className="text-blue-500 text-sm" />
                  </span>
                  <div>
                    <div className="font-medium text-sm">{e.teacherName}</div>
                    <div className="text-xs text-gray-400">{e.subject} · {e.evaluationType}</div>
                  </div>
                </div>
                <Tag color={e.score && e.score >= 4 ? 'green' : 'orange'}>
                  {e.evaluationType}
                </Tag>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-2">{e.content}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span><CalendarOutlined className="mr-1" />{e.createdAt}</span>
                {e.score && <Rate disabled value={e.score} style={{ fontSize: 14 }} />}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-4 text-xs text-gray-300">
        共 {records.length} 条评语记录
      </div>
    </div>
  )
}
