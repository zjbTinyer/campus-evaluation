import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { agentQuery } from '../../api/agent'
import type { AgentResponse, Segment } from '../../types/agent'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

/** 快捷提问 */
const SUGGESTIONS = [
  { text: '最近老师有什么评语？', icon: '📝', cat: 'eval' },
  { text: '有什么任务需要完成？', icon: '✅', cat: 'task' },
  { text: '获得了哪些荣誉？',    icon: '🏆', cat: 'honor' },
  { text: '最近有什么活动？',    icon: '🎉', cat: 'activity' },
]

/** 分类配置 */
const CAT: Record<string, { icon: string; tag: string }> = {
  QUERY_EVALUATION: { icon: '📝', tag: 'tag-eval' },
  QUERY_HONOR:      { icon: '🏆', tag: 'tag-honor' },
  QUERY_TASK:       { icon: '✅', tag: 'tag-task' },
  QUERY_LEAVE:      { icon: '📋', tag: 'tag-leave' },
  QUERY_ACTIVITY:   { icon: '🎉', tag: 'tag-activity' },
  QUERY_ARCHIVE:    { icon: '📂', tag: 'tag-archive' },
}

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

  const clearResult = () => { setResult(null); setError(null); setSessionId(null) }

  // ========== 欢迎屏 ==========
  if (!result && !loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start pt-12 items-center px-6 pb-32">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-5">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-hero font-extrabold text-ink text-center mb-1 tracking-tight">
            {currentStudent ? `${currentStudent.name}家长，您好` : '校园评价'}
          </h1>
          <p className="text-sm text-ink-light text-center mb-8">
            直接输入问题，我来帮您查找信息
          </p>

          <div className="w-full max-w-sm space-y-2.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSearch(s.text)}
                className="w-full text-left px-4 py-3.5 rounded-card bg-white border border-divider
                           text-sm text-ink hover:shadow-card active:scale-[0.98] transition-all flex items-center gap-3"
              >
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <span>{s.text}</span>
                <span className="ml-auto text-ink-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 欢迎屏：搜索栏在底部 — 拇指可达 */}
        <BottomSearchBar
          query={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          loading={false}
        />
      </div>
    )
  }

  // ========== 结果屏 — 搜索栏在顶部 ==========
  return (
    <div className="flex flex-col h-full">
      {/* 顶部搜索栏：紧凑型，可继续搜索 */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-divider">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearResult}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-paper active:bg-divider transition-colors text-ink-light"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 flex items-center gap-2 bg-paper border border-divider rounded-pill px-3 py-2 focus-glow transition-shadow">
            <span className="text-base flex-shrink-0">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="继续提问…"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted
                         outline-none border-none min-w-0"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs
                           flex items-center justify-center active:scale-90 transition-transform
                           disabled:opacity-50"
              >
                {loading ? '◌' : '→'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 结果滚动区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-4">
        {/* 加载中 */}
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 rounded-full border-2 border-primary-light border-t-primary animate-spin mb-4" />
            <p className="text-sm text-ink-light">正在查询中…</p>
          </div>
        )}

        {/* 错误 */}
        {error && (
          <div className="bg-seal/6 border border-seal/20 rounded-card p-4 mb-4">
            <p className="text-sm text-seal">{error}</p>
            <button onClick={() => handleSearch()} className="text-xs text-sky mt-2 font-medium">重试</button>
          </div>
        )}

        {/* 结果 */}
        {result && !loading && (
          <>
            {result.summary && (
              <div className="mb-4 px-4 py-3.5 rounded-card bg-white border border-divider shadow-card">
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                  {result.summary}
                </p>
              </div>
            )}

            {result.segments?.map((seg, i) => (
              <SegmentCard key={i} segment={seg} />
            ))}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-4 mb-4">
                <p className="text-2xs text-ink-muted mb-2 font-medium">你可能还想问</p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 rounded-pill text-xs border border-divider bg-white
                                 text-ink hover:border-primary/30 hover:text-primary active:scale-95 transition-all"
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
    </div>
  )
}

/**
 * 底部搜索栏 — 仅欢迎屏使用
 */
function BottomSearchBar({ query, onChange, onSubmit, loading }: {
  query: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="flex-shrink-0 bg-gradient-to-t from-paper via-paper to-transparent pt-3 pb-4 px-4 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center gap-2 bg-white border border-divider rounded-pill px-4 py-2.5 focus-glow shadow-card transition-shadow">
        <span className="text-lg flex-shrink-0">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="试试问：小明最近数学怎么样？"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted
                     outline-none border-none min-w-0"
          disabled={loading}
        />
        {query && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-white text-sm
                       flex items-center justify-center active:scale-90 transition-transform
                       disabled:opacity-50 shadow-sm"
          >
            {loading ? '◌' : '→'}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * 结果卡片
 */
function SegmentCard({ segment }: { segment: Segment }) {
  const navigate = useNavigate()
  const style = CAT[segment.intent]

  return (
    <div className="mb-3 rounded-card bg-white shadow-card card-enter overflow-hidden">
      {style && (
        <div className="flex items-center gap-1.5 px-3 pt-3 pb-1">
          <span className="text-sm">{style.icon}</span>
          <span className={`text-2xs font-semibold px-2 py-0.5 rounded-pill ${style.tag}`}>
            {segment.intent?.replace('QUERY_', '') || '结果'}
          </span>
        </div>
      )}

      <div className="p-3 pt-2">
        {segment.responseText && (
          <p className="text-sm text-ink leading-relaxed mb-2 whitespace-pre-line">
            {segment.responseText}
          </p>
        )}

        {segment.suggestedActions && segment.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-divider">
            {segment.suggestedActions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(a.url)}
                className={`px-3 py-1.5 rounded-pill text-xs font-semibold transition-all active:scale-95
                  ${a.type === 'action'
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-primary-light text-primary border border-primary/20 hover:bg-primary/10'
                  }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
