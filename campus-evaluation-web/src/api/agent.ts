import type { AgentRequest, AgentResponse } from '../types/agent'
import { isMockMode } from './index'
import { mockAgentQuery } from './mock'

/**
 * 提交自然语言查询 — Agent 主入口
 *
 * Mock 模式: 直接返回 Mock 数据
 * 真实模式: 调用 POST /api/v1/agent/query
 */
export async function agentQuery(data: AgentRequest): Promise<AgentResponse> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
    return mockAgentQuery(data.query)
  }

  const client = (await import('./client')).default
  const res = await client.post<{ code: number; data: AgentResponse }>('/agent/query', data)
  return res.data.data
}

export async function agentHistory(sessionId?: string) {
  if (isMockMode()) return { sessionId, currentStudentId: '1', linkedStudents: [], history: [] }

  const client = (await import('./client')).default
  const res = await client.get('/agent/history', { params: { sessionId } })
  return res.data.data
}

export async function switchStudent(studentId: string) {
  if (isMockMode()) return { code: 0 }
  const client = (await import('./client')).default
  const res = await client.post('/agent/student/switch', null, { params: { studentId } })
  return res.data
}
