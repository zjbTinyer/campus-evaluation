import { useState, useCallback, useRef } from 'react'
import { agentQuery } from '../api/agent'
import type { AgentResponse } from '../types/agent'

interface UseAgentQueryReturn {
  loading: boolean
  result: AgentResponse | null
  error: string | null
  query: (text: string, studentId?: string) => Promise<void>
  reset: () => void
}

/**
 * Agent 查询 Hook — 封装查询状态管理
 */
export function useAgentQuery(): UseAgentQueryReturn {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  const query = useCallback(async (text: string, studentId?: string) => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await agentQuery({
        query: text,
        studentId,
        sessionId: sessionIdRef.current || undefined,
      })
      setResult(response)
      sessionIdRef.current = response.sessionId
    } catch (e: any) {
      setError(e.message || '查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    sessionIdRef.current = null
  }, [])

  return { loading, result, error, query, reset }
}
