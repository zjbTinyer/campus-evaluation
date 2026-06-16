import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { agentQuery } from '../../api/agent'
import type { AgentResponse, Segment } from '../../types/agent'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import {
  EvaluationIcon, TaskIcon, HonorIcon, ActivityIcon, SearchIcon,
  ChevronLeft, ArrowRight, CheckIcon, RefreshIcon,
} from '../../components/icons'

/** 快捷提问 */
const SUGGESTIONS = [
  { text: '最近老师有什么评语？', cat: 'eval' as const, Icon: EvaluationIcon },
  { text: '有什么任务需要完成？', cat: 'task' as const, Icon: TaskIcon },
  { text: '获得了哪些荣誉？',    cat: 'honor' as const, Icon: HonorIcon },
  { text: '最近有什么活动？',    cat: 'activity' as const, Icon: ActivityIcon },
]

/** 分类配置 */
const CAT: Record<string, { Icon: typeof EvaluationIcon; tag: string }> = {
  QUERY_EVALUATION: { Icon: EvaluationIcon, tag: 'tag-eval' },
  QUERY_HONOR:      { Icon: HonorIcon, tag: 'tag-honor' },
  QUERY_TASK:       { Icon: TaskIcon, tag: 'tag-task' },
  QUERY_LEAVE:      { Icon: EvaluationIcon, tag: 'tag-leave' },
  QUERY_ACTIVITY:   { Icon: ActivityIcon, tag: 'tag-activity' },
  QUERY_ARCHIVE:    { Icon: EvaluationIcon, tag: 'tag-archive' },
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
          {/* 搜索图标 — 发光 */}
          <div className="w-20 h-20 rounded-full bg-surface border border-divider flex items-center justify-center mb-5 shadow-glow-sm pulse-glow">
            <SearchIcon size={36} className="text-primary" />
          </div>
          <h1 className="text-hero font-extrabold text-fg text-center mb-1 tracking-tight font-display">
            {currentStudent ? `${currentStudent.name}家长，您好` : '校园评价'}
          </h1>
          <p className="text-sm text-fg-muted text-center mb-8">
            直接输入问题，我来帮您查找信息
          </p>

          {/* 建议提问 — glass 卡片 */}
          <div className="w-full max-w-sm space-y-2.5">
            {SUGGESTIONS.map((s, i) => {
              const { Icon } = s
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSearch(s.text)}
                  className={`w-full text-left px-4 py-3.5 rounded-card border border-divider
                    bg-surface card-hover transition-all flex items-center gap-3 shimmer
                    border-${s.cat}`}
                >
                  <span className="flex-shrink-0 text-fg-muted">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm text-fg flex-1">{s.text}</span>
                  <span className="text-fg-dim">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                </button>
              )
            })}
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
      {/* 顶部搜索栏：紧凑型 */}
      <div className="flex-shrink-0 px-4 py-3 glass border-b border-divider">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearResult}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface active:bg-border transition-colors text-fg-muted"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-bg-elevated border border-divider rounded-pill px-3 py-2 focus-glow transition-all">
            <SearchIcon size={16} className="flex-shrink-0 text-fg-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="继续提问…"
              className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-dim
                         outline-none border-none min-w-0"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-bg text-xs
                           flex items-center justify-center active:scale-90 transition-transform
                           disabled:opacity-50 shadow-glow-sm"
              >
                <ArrowRight size={14} />
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
            <div className="w-10 h-10 rounded-full border-2 border-divider border-t-primary animate-spin mb-4" />
            <p className="text-sm text-fg-muted">正在查询中…</p>
          </div>
        )}

        {/* 错误 */}
        {error && (
          <div className="bg-accent/10 border border-accent/20 rounded-card p-4 mb-4">
            <p className="text-sm text-accent">{error}</p>
            <button onClick={() => handleSearch()} className="text-xs text-secondary mt-2 font-medium flex items-center gap-1">
              <RefreshIcon size={12} /> 重试
            </button>
          </div>
        )}

        {/* 结果 */}
        {result && !loading && (
          <>
            {result.summary && (
              <div className="mb-4 px-4 py-3.5 rounded-card bg-surface border border-divider shadow-card">
                <p className="text-sm text-fg leading-relaxed whitespace-pre-line">
                  {result.summary}
                </p>
              </div>
            )}

            {result.segments?.map((seg, i) => (
              <SegmentCard key={i} segment={seg} />
            ))}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-4 mb-4">
                <p className="text-2xs text-fg-muted mb-2 font-medium">你可能还想问</p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 rounded-pill text-xs border border-divider bg-surface
                                 text-fg hover:border-primary/30 hover:text-primary active:scale-95 transition-all"
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
 * 底部搜索栏 — 仅欢迎屏使用，带玻璃效果和发光
 */
function BottomSearchBar({ query, onChange, onSubmit, loading }: {
  query: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="flex-shrink-0 pt-3 pb-4 px-4 safe-bottom"
      style={{ background: 'linear-gradient(to top, rgb(var(--c-bg)) 60%, transparent 100%)' }}>
      <div className="max-w-lg mx-auto flex items-center gap-2 glass rounded-pill px-4 py-2.5 focus-glow shadow-glow-sm transition-all">
        <SearchIcon size={20} className="flex-shrink-0 text-fg-dim" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="试试问：小明最近数学怎么样？"
          className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-dim
                     outline-none border-none min-w-0"
          disabled={loading}
        />
        {query && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-bg text-sm
                       flex items-center justify-center active:scale-90 transition-transform
                       disabled:opacity-50 shadow-glow-sm"
          >
            <ArrowRight size={16} />
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
  const { Icon } = style || { Icon: EvaluationIcon }

  return (
    <div className="mb-3 rounded-card bg-surface border border-divider shadow-card card-enter overflow-hidden">
      {style && (
        <div className="flex items-center gap-1.5 px-3 pt-3 pb-1">
          <Icon size={16} className="text-fg-muted" />
          <span className={`text-2xs font-semibold px-2 py-0.5 rounded-pill ${style.tag}`}>
            {segment.intent?.replace('QUERY_', '') || '结果'}
          </span>
        </div>
      )}

      <div className="p-3 pt-2">
        {segment.responseText && (
          <p className="text-sm text-fg leading-relaxed mb-2 whitespace-pre-line">
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
                    ? 'bg-primary text-bg hover:opacity-90 shadow-glow-sm'
                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15'
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
