import type { AgentRequest, AgentResponse } from '../types/agent'
import { MOCK_MODE, mockAgentQuery } from './mock'

/**
 * 提交自然语言查询 — Agent 主入口
 *
 * Demo 模式：直接返回 Mock 数据，模拟 200-500ms 网络延迟
 */
export async function agentQuery(data: AgentRequest): Promise<AgentResponse> {
  if (MOCK_MODE) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
    return mockAgentQuery(data.query)
  }

  const client = (await import('./client')).default
  const res = await client.post<{ code: number; data: AgentResponse }>('/agent/query', data)
  return res.data.data
}

/**
 * 获取 Agent 会话历史
 */
export async function agentHistory(sessionId?: string) {
  if (MOCK_MODE) return { sessionId, currentStudentId: '1', linkedStudents: [], history: [] }

  const client = (await import('./client')).default
  const res = await client.get('/agent/history', { params: { sessionId } })
  return res.data.data
}

/**
 * 切换当前学生
 */
export async function switchStudent(studentId: string) {
  if (MOCK_MODE) return { code: 0 }
  const client = (await import('./client')).default
  const res = await client.post('/agent/student/switch', null, { params: { studentId } })
  return res.data
}
