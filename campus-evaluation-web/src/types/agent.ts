/** Agent 请求 */
export interface AgentRequest {
  query: string
  studentId?: string
  sessionId?: string
  mode?: 'auto' | 'search_only' | 'action'
}

/** Agent 响应 */
export interface AgentResponse {
  sessionId: string
  intents: IntentItem[]
  segments: Segment[]
  summary: string
  suggestions: string[]
  elapsedMs: number
}

export interface IntentItem {
  type: string
  confidence: number
  tool: string
}

export interface Segment {
  intent: string
  tool: string
  result: unknown
  responseText: string
  suggestedActions: Action[]
}

export interface Action {
  label: string
  url: string
  type: 'navigate' | 'action' | 'confirm'
}
