/**
 * Mock API — Demo 模式，所有接口返回模拟数据，不依赖后端
 */

import type { AgentResponse } from '../types/agent'

/** 是否 Mock 模式 */
export const MOCK_MODE = true

/**
 * Mock: Agent 查询 — 模拟完整的多意图 NL 搜索响应
 */
export function mockAgentQuery(query: string): AgentResponse {
  const lower = query.toLowerCase()

  // 评语相关
  if (lower.includes('评语') || lower.includes('表现') || lower.includes('评价') || lower.includes('数学')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_EVALUATION', confidence: 0.95, tool: 'query_evaluations' },
      ],
      segments: [
        {
          intent: 'QUERY_EVALUATION',
          tool: 'query_evaluations',
          result: {
            records: [
              {
                id: 1,
                teacherName: '李老师',
                subject: '数学',
                evaluationType: '课堂表现',
                content: '小明近期课堂专注度有明显提升，主动回答问题次数增多，作业完成质量好。继续保持！',
                score: 4,
                createdAt: '2026-06-10',
              },
              {
                id: 2,
                teacherName: '李老师',
                subject: '数学',
                evaluationType: '周评',
                content: '本周数学单元测试成绩92分，比上次提高了5分，特别是在应用题部分进步明显。',
                score: 5,
                createdAt: '2026-06-08',
              },
            ],
            total: 2,
          },
          responseText: '李老师对小明最近的数学表现给予了积极评价：课堂专注度提升，单元测试92分（比上次提高5分）。共有2条相关评语。',
          suggestedActions: [
            { label: '查看全部评语', url: '/evaluations', type: 'navigate' },
          ],
        },
      ],
      summary: '李老师对小明最近的数学表现评价积极：课堂专注度提升，单元测试92分（比上次提高5分）。共有2条评语记录。',
      suggestions: ['有什么任务需要完成？', '最近获得了哪些荣誉？'],
      elapsedMs: 120,
    }
  }

  // 荣誉相关
  if (lower.includes('荣誉') || lower.includes('奖') || lower.includes('获奖')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_HONOR', confidence: 0.93, tool: 'query_honors' },
      ],
      segments: [
        {
          intent: 'QUERY_HONOR',
          tool: 'query_honors',
          result: {
            records: [
              {
                id: 1,
                name: '数学竞赛一等奖',
                honorLevel: '市级',
                category: '竞赛',
                grantDate: '2026-05-20',
                grantOrg: '市教育局',
              },
              {
                id: 2,
                name: '三好学生',
                honorLevel: '校级',
                category: '品德',
                grantDate: '2026-03-01',
                grantOrg: '阳光小学',
              },
              {
                id: 3,
                name: '运动会100米第一名',
                honorLevel: '校级',
                category: '体育',
                grantDate: '2026-04-15',
                grantOrg: '阳光小学',
              },
            ],
            total: 3,
          },
          responseText: '小明这学期共获得3项荣誉：市级数学竞赛一等奖、校三好学生、运动会100米第一名。表现非常出色！',
          suggestedActions: [
            { label: '查看荣誉墙', url: '/honors', type: 'navigate' },
          ],
        },
      ],
      summary: '小明这学期共获得3项荣誉：市级数学竞赛一等奖、校三好学生、运动会100米第一名。表现非常出色！',
      suggestions: ['最近考试怎么样？', '有什么活动可以参加？'],
      elapsedMs: 85,
    }
  }

  // 任务相关
  if (lower.includes('任务') || lower.includes('打卡') || lower.includes('作业')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_TASK', confidence: 0.91, tool: 'query_tasks' },
      ],
      segments: [
        {
          intent: 'QUERY_TASK',
          tool: 'query_tasks',
          result: {
            records: [
              {
                id: 1,
                title: '跳绳200个',
                taskType: '运动',
                status: '待完成',
                dueDate: '2026-06-15',
                checkinCount: 0,
                totalCount: 1,
              },
              {
                id: 2,
                title: '古诗《静夜思》背诵',
                taskType: '阅读',
                status: '已完成',
                dueDate: '2026-06-12',
                checkinCount: 1,
                totalCount: 1,
              },
              {
                id: 3,
                title: '数学练习册P45-48',
                taskType: '作业',
                status: '已完成',
                dueDate: '2026-06-11',
                checkinCount: 1,
                totalCount: 1,
              },
            ],
            total: 3,
          },
          responseText: '小明共有3项任务，已完成2项（古诗背诵、数学练习册），还有1项待完成：',
          suggestedActions: [
            { label: '去打卡跳绳', url: '/tasks', type: 'action' },
            { label: '查看全部任务', url: '/tasks', type: 'navigate' },
          ],
        },
      ],
      summary: '小明共有3项任务，已完成2项。还有1项「跳绳200个」待完成，截止日期6月15日。需要帮孩子打卡吗？',
      suggestions: ['最近老师有什么评语？', '查看历史档案'],
      elapsedMs: 95,
    }
  }

  // 请假相关
  if (lower.includes('请假') || lower.includes('假条')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_LEAVE', confidence: 0.94, tool: 'query_leaves' },
      ],
      segments: [
        {
          intent: 'QUERY_LEAVE',
          tool: 'query_leaves',
          result: {
            records: [
              {
                id: 1,
                leaveType: '病假',
                startDate: '2026-05-10',
                endDate: '2026-05-11',
                reason: '感冒发烧，需在家休息',
                status: '已批准',
                approveRemark: '已了解情况，注意休息',
              },
            ],
            total: 1,
          },
          responseText: '最近一条请假记录：5月10-11日病假，已批准。',
          suggestedActions: [
            { label: '提交请假', url: '/leaves/new', type: 'action' },
            { label: '查看请假记录', url: '/leaves', type: 'navigate' },
          ],
        },
      ],
      summary: '最近有一条病假记录（5月10-11日），已批准。',
      suggestions: ['最近有什么活动？', '查看任务完成情况'],
      elapsedMs: 78,
    }
  }

  // 活动相关
  if (lower.includes('活动') || lower.includes('运动会') || lower.includes('家长会')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_ACTIVITY', confidence: 0.92, tool: 'query_activities' },
      ],
      segments: [
        {
          intent: 'QUERY_ACTIVITY',
          tool: 'query_activities',
          result: {
            records: [
              {
                id: 1,
                title: '春季运动会',
                activityType: '文体活动',
                startTime: '2026-06-20 08:00',
                endTime: '2026-06-20 16:00',
                location: '学校操场',
                registrationDeadline: '2026-06-18',
                status: '报名中',
                currentCount: 86,
              },
              {
                id: 2,
                title: '期末家长会',
                activityType: '家长会',
                startTime: '2026-07-05 14:00',
                endTime: '2026-07-05 16:00',
                location: '各班级教室',
                status: '报名中',
              },
            ],
            total: 2,
          },
          responseText: '近期有2个活动：春季运动会（6月20日，报名中）、期末家长会（7月5日）。',
          suggestedActions: [
            { label: '报名运动会', url: '/activities', type: 'action' },
            { label: '查看全部活动', url: '/activities', type: 'navigate' },
          ],
        },
      ],
      summary: '近期有2个活动：春季运动会（6月20日，报名截止6月18日）和期末家长会（7月5日）。',
      suggestions: ['运动会报名截止时间？', '查看孩子的荣誉'],
      elapsedMs: 110,
    }
  }

  // 档案相关
  if (lower.includes('档案') || lower.includes('上学') || lower.includes('历史') || lower.includes('回顾')) {
    return {
      sessionId: 'mock-sess-001',
      intents: [
        { type: 'QUERY_ARCHIVE', confidence: 0.90, tool: 'query_archive' },
      ],
      segments: [
        {
          intent: 'QUERY_ARCHIVE',
          tool: 'query_archive',
          result: {
            records: [
              {
                id: 1,
                archiveType: '期末档案',
                semesterName: '2025-2026学年第一学期',
                summary: '综合表现优秀。出勤率98.5%，数学、英语学科表现突出，获得三好学生称号。体育方面获运动会100米第一。建议下学期继续加强语文阅读量。',
                attendanceRate: 98.5,
                totalScore: 91.3,
                rank: 5,
              },
            ],
            total: 1,
          },
          responseText: '上学期档案已发布：综合表现优秀，班级排名第5，出勤率98.5%。数学、英语突出，体育获运动会奖项。',
          suggestedActions: [
            { label: '查看完整档案', url: '/archives', type: 'navigate' },
          ],
        },
      ],
      summary: '上学期（2025-2026第一学期）档案已发布：班级排名第5/42，出勤率98.5%。综合评价优秀。',
      suggestions: ['这学期表现怎么样？', '获得了哪些荣誉？'],
      elapsedMs: 130,
    }
  }

  // 综合概览（默认）
  return {
    sessionId: 'mock-sess-001',
    intents: [
      { type: 'QUERY_OVERVIEW', confidence: 0.88, tool: 'query_overview' },
    ],
    segments: [
      {
        intent: 'QUERY_OVERVIEW',
        tool: 'query_overview',
        result: { recentEvaluations: 2, pendingTasks: 1, recentHonors: 3 },
        responseText: '小明最近表现不错！数学课堂专注度提升，单元测试92分。有1项任务待完成（跳绳200个）。本学期已获得3项荣誉。',
        suggestedActions: [
          { label: '查看评语详情', url: '/evaluations', type: 'navigate' },
          { label: '去打卡任务', url: '/tasks', type: 'action' },
        ],
      },
    ],
    summary: '小明最近整体表现不错！以下是近期的综合情况。',
    suggestions: [
      '最近数学怎么样？',
      '有什么任务需要完成？',
      '查看获得的荣誉',
      '近期有什么活动？',
    ],
    elapsedMs: 150,
  }
}
