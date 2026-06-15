import { useState, useCallback, useRef } from 'react'
import type { AgentResponse, Segment } from '../types/agent'

interface SSEState {
  loading: boolean
  intents: AgentResponse['intents'] | null
  segments: Segment[]
  summary: string
  suggestions: string[]
  done: boolean
  error: string | null
}

/**
 * SSE 流式 Agent 查询 Hook
 *
 * 使用 Server-Sent Events 逐步渲染结果，提供更好的用户体验。
 *
 * 注意: 微信 WebView 对 EventSource 支持有限，建议在微信环境自动降级到非流式 query。
 */
export function useSSEAgent() {
  const [state, setState] = useState<SSEState>({
    loading: false,
    intents: null,
    segments: [],
    summary: '',
    suggestions: [],
    done: false,
    error: null,
  })
  const eventSourceRef = useRef<EventSource | null>(null)

  const query = useCallback(async (text: string) => {
    // 清理上一次的 EventSource
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setState({
      loading: true,
      intents: null,
      segments: [],
      summary: '',
      suggestions: [],
      done: false,
      error: null,
    })

    const token = localStorage.getItem('token')

    try {
      // 使用 fetch + ReadableStream 模拟 SSE（比 EventSource 更可控）
      const response = await fetch('/api/v1/agent/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('不支持流式响应')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event:')) {
            const eventType = line.slice(6).trim()
            // 等待 data 行
            continue
          }
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5).trim()
            try {
              const data = JSON.parse(jsonStr)
              // 根据前面记录的 eventType 处理
              handleSSEEvent(data)
            } catch {
              // 跳过解析失败的行
            }
          }
        }
      }
    } catch (e: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        done: true,
        error: e.message || '连接中断',
      }))
    }
  }, [])

  const handleSSEEvent = useCallback((data: any) => {
    // 简化处理：通过数据结构判断事件类型
    if (Array.isArray(data)) {
      // intent 列表 或 suggestions 列表
      if (data.length > 0 && data[0]?.type) {
        setState((prev) => ({ ...prev, intents: data }))
      } else {
        setState((prev) => ({ ...prev, suggestions: data.map(String) }))
      }
    } else if (typeof data === 'string') {
      setState((prev) => ({ ...prev, summary: data }))
    } else if (data?.tool) {
      // segment
      setState((prev) => ({ ...prev, segments: [...prev.segments, data] }))
    } else if (data?.sessionId) {
      setState((prev) => ({ ...prev, loading: false, done: true }))
    }
  }, [])

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setState({
      loading: false,
      intents: null,
      segments: [],
      summary: '',
      suggestions: [],
      done: false,
      error: null,
    })
  }, [])

  return { ...state, query, reset }
}
