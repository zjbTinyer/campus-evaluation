import { useState, useCallback } from 'react'
import { agentQuery } from '../../api/agent'
import type { AgentResponse, Segment } from '../../types/agent'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

/** 快捷提问 */
const SUGGESTIONS = [
  { text: '最近老师有什么评语？', icon: '📝' },
  { text: '有什么任务需要完成？', icon: '✅' },
  { text: '获得了哪些荣誉？', icon: '🏆' },
  { text: '最近有什么活动？', icon: '🎉' },
]

/** 分类配置 */
const CAT_STYLES: Record<string, { border: string; tag: string; icon: string }> = {
  QUERY_EVALUATION: { border: 'border-eval', tag: 'tag-eval', icon: '📝' },
  QUERY_HONOR:      { border: 'border-honor', tag: 'tag-honor', icon: '🏆' },
  QUERY_TASK:       { border: 'border-task', tag: 'tag-task', icon: '✅' },
  QUERY_LEAVE:      { border: 'border-leave', tag: 'tag-leave', icon: '📋' },
  QUERY_ACTIVITY:   { border: 'border-activity', tag: 'tag-activity', icon: '🎉' },
  QUERY_ARCHIVE:    { border: 'border-archive', tag: 'tag-eval', icon: '📂' },
}

/** 标志元素：底部搜索栏 — 整个产品的交互核心 */
export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { currentStudent } = useCurrentStudent()

  const handleSearch = useCallback(async (text?: string) => {
    const q = (text || query).trim()
    if (!q) return

    setLoading(true)
    setError(null)

    try {
      const response = await agentQuery({ query: q, studentId: currentStudent?.id, sessionId: sessionId || undefined })
      setResult(response)
      setSessionId(response.sessionId)
      setQuery('')
    } catch (e: any) {
      setError(e.message || '查询失败')
    } finally {
      setLoading(false)
    }
  }, [query, currentStudent, sessionId])

  // ---------- 空状态（初始） ----------
  if (!result && !loading) {
    return (
      <div className="flex flex-col h-full">
        {/* 欢迎 */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pb-8">
          <p className="text-5xl mb-4">🏫</p>
          <h1 className="font-display text-hero font-bold text-ink text-center mb-1">
            {currentStudent ? `${currentStudent.name}家长，您好` : '欢迎使用校园评价'}
          </h1>
          <p className="text-sm text-ink-light text-center mb-8">
            直接输入问题，我来帮您查找信息
          </p>

          {/* 快捷提问 */}
          <div className="w-full max-w-sm space-y-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearch(s.text)}
                className="w-full text-left px-4 py-3 rounded-card bg-surface border border-divider
                           text-sm text-ink hover:shadow-card active:scale-[0.98] transition-all flex items-center gap-3"
              >
                <span className="text-lg">{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 底部搜索栏 */}
        <BottomSearchBar
          query={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          loading={false}
        />
      </div>
    )
  }

  // ---------- 结果状态 ----------
  return (
    <div className="flex flex-col h-full">
      {/* 结果区域 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-2">
        {/* 加载中 */}
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-8 h-8 border-2 border-vermilion/30 border-t-vermilion rounded-full animate-spin mb-3" />
            <p className="text-sm text-ink-light">正在查询中…</p>
          </div>
        )}

        {/* 错误 */}
        {error && (
          <div className="bg-vermilion/5 border border-vermilion/20 rounded-card p-4 mb-4">
            <p className="text-sm text-vermilion">{error}</p>
            <button onClick={() => handleSearch()} className="text-xs text-calm mt-2 underline">重试</button>
          </div>
        )}

        {/* 结果 */}
        {result && !loading && (
          <>
            {/* 综合摘要 */}
            {result.summary && (
              <div className="mb-4 px-4 py-3 rounded-card bg-surface border border-divider">
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                  {result.summary}
                </p>
              </div>
            )}

            {/* 各分段 */}
            {result.segments?.map((seg, i) => (
              <SegmentCard key={i} segment={seg} />
            ))}

            {/* 追问建议 */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-4 mb-6">
                <p className="text-2xs text-ink-light mb-2">你可能还想问</p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 rounded-full text-xs border border-divider bg-surface
                                 text-ink hover:bg-paper active:scale-95 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部搜索栏 — 始终可见 */}
      <BottomSearchBar
        query={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        loading={loading}
      />
    </div>
  )
}

/**
 * 底部搜索栏 — 标志元素
 * 灵感: 聊天输入框，始终在拇指可达区域
 */
function BottomSearchBar({ query, onChange, onSubmit, loading }: {
  query: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="sticky bottom-16 left-0 right-0 bg-gradient-to-t from-paper via-paper to-transparent pt-3 pb-4 px-4 safe-bottom z-20">
      <div className="max-w-lg mx-auto flex items-center gap-2 bg-surface border border-divider rounded-full px-4 py-2 search-glow transition-shadow">
        <span className="text-lg flex-shrink-0">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="试试问：小明最近数学怎么样？"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-light/50
                     outline-none border-none min-w-0"
          disabled={loading}
        />
        {query && (
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-vermilion text-white text-sm
                       flex items-center justify-center active:scale-90 transition-transform
                       disabled:opacity-50"
          >
            {loading ? '◌' : '→'}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * 分类线程卡片 — 左边框色线标识类型
 */
function SegmentCard({ segment }: { segment: Segment }) {
  const style = CAT_STYLES[segment.intent] || {}
  const isAction = segment.suggestedActions?.some((a) => a.type === 'action')

  return (
    <div className={`mb-3 rounded-card bg-surface ${style.border || 'border-l-3 border-ink-light/30'} shadow-card card-enter overflow-hidden`}>
      <div className="p-3">
        {/* 回复文本 */}
        {segment.responseText && (
          <p className="text-sm text-ink leading-relaxed mb-2 whitespace-pre-line">
            {segment.responseText}
          </p>
        )}

        {/* 操作按钮 */}
        {segment.suggestedActions && segment.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-divider">
            {segment.suggestedActions.map((a, i) => (
              <a
                key={i}
                href={a.url}
                onClick={(e) => { e.preventDefault(); window.location.href = a.url }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95
                  ${a.type === 'action'
                    ? 'bg-vermilion text-white'
                    : 'bg-paper text-calm border border-calm/20 hover:bg-calm/5'
                  }`}
              >
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
