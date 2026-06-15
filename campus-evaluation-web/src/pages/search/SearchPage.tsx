import { useState, useRef, useCallback } from 'react'
import { Input, Spin, Tag, Card, Button } from 'antd'
import { SearchOutlined, AudioOutlined } from '@ant-design/icons'
import { agentQuery } from '../../api/agent'
import type { AgentResponse, Segment } from '../../types/agent'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

/** 快捷提问建议 */
const SUGGESTIONS = [
  '最近老师有什么评语？',
  '有什么任务需要完成？',
  '这学期获得了哪些荣誉？',
  '最近有什么活动？',
  '查看历史档案',
]

/**
 * 搜索页 — 系统默认首页，用户通过自然语言搜索获取所有信息
 */
export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { currentStudent } = useCurrentStudent()
  const inputRef = useRef<any>(null)

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const q = (searchQuery || query).trim()
    if (!q) return

    setLoading(true)
    setError(null)

    try {
      const response = await agentQuery({
        query: q,
        studentId: currentStudent?.id,
        sessionId: sessionId || undefined,
      })
      setResult(response)
      setSessionId(response.sessionId)
      setQuery('') // 清空搜索框
    } catch (e: any) {
      setError(e.message || '查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [query, currentStudent, sessionId])

  return (
    <div className="p-4 flex flex-col min-h-full">
      {/* 欢迎语 */}
      {!result && !loading && (
        <div className="text-center mt-8 mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            {currentStudent
              ? `${currentStudent.name}家长，您好！`
              : '欢迎使用校园评价'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            直接输入问题，我来帮您查找信息
          </p>
        </div>
      )}

      {/* 搜索框 */}
      <div className="relative mb-4">
        <Input
          ref={inputRef}
          size="large"
          placeholder="试试问：小明最近数学怎么样？"
          prefix={<SearchOutlined className="text-gray-400" />}
          suffix={
            <AudioOutlined className="text-gray-400 cursor-pointer" />
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={() => handleSearch()}
          className="rounded-xl shadow-sm"
          disabled={loading}
        />
        {query && (
          <Button
            type="primary"
            size="small"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
            onClick={() => handleSearch()}
            loading={loading}
          >
            搜索
          </Button>
        )}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex flex-col items-center py-12">
          <Spin size="large" />
          <p className="text-gray-400 mt-4 text-sm">正在查询中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <Card className="mb-4 bg-red-50 border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
          <Button
            type="link"
            size="small"
            onClick={() => handleSearch()}
            className="mt-2"
          >
            重试
          </Button>
        </Card>
      )}

      {/* 搜索结果 */}
      {result && !loading && (
        <div className="flex-1">
          {/* 综合摘要 */}
          {result.summary && (
            <Card className="mb-4 bg-blue-50 border-blue-100">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                {result.summary}
              </p>
            </Card>
          )}

          {/* 各分段结果 */}
          {result.segments?.map((seg, i) => (
            <SegmentCard key={i} segment={seg} />
          ))}

          {/* 追问建议 */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="mt-4 mb-8">
              <p className="text-xs text-gray-400 mb-2">你可能还想问：</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.map((s, i) => (
                  <Tag
                    key={i}
                    color="blue"
                    className="cursor-pointer px-3 py-1"
                    onClick={() => {
                      setQuery(s)
                      handleSearch(s)
                    }}
                  >
                    {s}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 快捷提问建议（初始状态） */}
      {!result && !loading && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-3">快捷提问</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <Tag
                key={i}
                className="cursor-pointer px-3 py-2 text-sm bg-white border border-gray-200 rounded-full"
                onClick={() => handleSearch(s)}
              >
                {s}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 搜索结果分段卡片
 */
function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <Card className="mb-3" size="small">
      {/* NL 回复文本 */}
      {segment.responseText && (
        <p className="text-sm text-gray-700 mb-2 leading-relaxed">
          {segment.responseText}
        </p>
      )}

      {/* 建议动作 */}
      {segment.suggestedActions && segment.suggestedActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {segment.suggestedActions.map((action, i) => (
            <Button
              key={i}
              type={action.type === 'action' ? 'primary' : 'default'}
              size="small"
              href={action.url}
              target={action.type === 'navigate' ? '_self' : undefined}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  )
}
