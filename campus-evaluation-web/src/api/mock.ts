/**
 * Mock API — Demo 模式完整数据集
 *
 * 覆盖: 评语/荣誉/任务/请假/活动/档案/通知/Dashboard/多意图
 */
import type { AgentResponse } from '../types/agent'

export const MOCK_MODE = true

// ============================================================
// Mock 数据集
// ============================================================

export const MOCK_STUDENTS = [
  { id: '1', name: '小明', className: '三年级二班', grade: 3, avatar: '' },
  { id: '2', name: '小红', className: '一年级一班', grade: 1, avatar: '' },
]

export const MOCK_EVALUATIONS = [
  { id: 1, studentId: '1', teacherName: '李老师', subject: '数学', evaluationType: '课堂表现',
    content: '小明近期课堂专注度有明显提升，主动回答问题次数增多，作业完成质量好。继续保持！', score: 4, createdAt: '2026-06-10' },
  { id: 2, studentId: '1', teacherName: '李老师', subject: '数学', evaluationType: '周评',
    content: '本周数学单元测试成绩92分，比上次提高了5分，特别是在应用题部分进步明显。', score: 5, createdAt: '2026-06-08' },
  { id: 3, studentId: '1', teacherName: '王老师', subject: '语文', evaluationType: '课堂表现',
    content: '小明作文水平有进步，本周的《我的妈妈》写得很有感情，字迹也比以前工整了。', score: 4, createdAt: '2026-06-07' },
  { id: 4, studentId: '1', teacherName: '王老师', subject: '语文', evaluationType: '期中评语',
    content: '语文期中考试85分，阅读理解做得不错，作文还需加强细节描写。课堂朗读声音洪亮，值得表扬。', score: 4, createdAt: '2026-05-20' },
  { id: 5, studentId: '1', teacherName: '张老师', subject: '英语', evaluationType: '课堂表现',
    content: '小明英语口语进步很大，敢于开口说英语了，单词听写正确率也从60%提高到85%。', score: 5, createdAt: '2026-06-05' },
  { id: 6, studentId: '1', teacherName: '张老师', subject: '英语', evaluationType: '周评',
    content: '本周英语课上积极举手发言，小组对话练习中表现活跃，口语流利度提升明显。', score: 4, createdAt: '2026-05-28' },
  { id: 7, studentId: '2', teacherName: '李老师', subject: '数学', evaluationType: '课堂表现',
    content: '小红口算能力很强，10以内加减法全部正确，速度全班第一。', score: 5, createdAt: '2026-06-12' },
  { id: 8, studentId: '2', teacherName: '王老师', subject: '语文', evaluationType: '周评',
    content: '小红拼音掌握得很好，能独立拼读课文，生字书写工整。', score: 5, createdAt: '2026-06-11' },
]

export const MOCK_HONORS = [
  { id: 1, studentId: '1', name: '数学竞赛一等奖', honorLevel: '市级', category: '竞赛',
    grantDate: '2026-05-20', grantOrg: '市教育局' },
  { id: 2, studentId: '1', name: '三好学生', honorLevel: '校级', category: '品德',
    grantDate: '2026-03-01', grantOrg: '阳光小学' },
  { id: 3, studentId: '1', name: '运动会100米第一名', honorLevel: '校级', category: '体育',
    grantDate: '2026-04-15', grantOrg: '阳光小学' },
  { id: 4, studentId: '1', name: '小小书法家', honorLevel: '校级', category: '艺术',
    grantDate: '2025-12-10', grantOrg: '阳光小学' },
  { id: 5, studentId: '2', name: '口算小能手', honorLevel: '校级', category: '学习',
    grantDate: '2026-06-01', grantOrg: '阳光小学' },
]

export const MOCK_TASKS = [
  { id: 1, studentId: '1', title: '跳绳200个', taskType: '运动', description: '每天跳绳200个，锻炼身体',
    assignedDate: '2026-06-10', dueDate: '2026-06-15', repeatType: '每日', status: '待完成',
    checkinCount: 0, totalCount: 1 },
  { id: 2, studentId: '1', title: '古诗《静夜思》背诵', taskType: '阅读', description: '熟练背诵并默写',
    assignedDate: '2026-06-08', dueDate: '2026-06-12', repeatType: '一次性', status: '已完成',
    checkinCount: 1, totalCount: 1 },
  { id: 3, studentId: '1', title: '数学练习册P45-48', taskType: '作业', description: '认真完成，家长签字',
    assignedDate: '2026-06-09', dueDate: '2026-06-11', repeatType: '一次性', status: '已完成',
    checkinCount: 1, totalCount: 1 },
  { id: 4, studentId: '1', title: '英语单词听写Unit5', taskType: '作业', description: '听写20个单词，错误订正3遍',
    assignedDate: '2026-06-12', dueDate: '2026-06-14', repeatType: '一次性', status: '待完成',
    checkinCount: 0, totalCount: 1 },
  { id: 5, studentId: '1', title: '帮妈妈做家务', taskType: '家务', description: '洗碗或扫地，拍照上传',
    assignedDate: '2026-06-01', dueDate: '2026-06-30', repeatType: '每周', status: '进行中',
    checkinCount: 2, totalCount: 4 },
  { id: 6, studentId: '2', title: '拼音拼读练习', taskType: '作业', description: '每天拼读10个音节',
    assignedDate: '2026-06-10', dueDate: '2026-06-15', repeatType: '每日', status: '待完成',
    checkinCount: 3, totalCount: 5 },
]

export const MOCK_LEAVES = [
  { id: 1, studentId: '1', leaveType: '病假', startDate: '2026-05-10', endDate: '2026-05-11',
    reason: '感冒发烧，需在家休息', status: '已批准', approveRemark: '已了解情况，注意休息',
    contactPhone: '13800009999', createdAt: '2026-05-09' },
  { id: 2, studentId: '1', leaveType: '事假', startDate: '2026-05-25', endDate: '2026-05-25',
    reason: '参加表哥婚礼', status: '已批准', approveRemark: '', contactPhone: '13800009999',
    createdAt: '2026-05-23' },
  { id: 3, studentId: '1', leaveType: '病假', startDate: '2026-06-16', endDate: '2026-06-16',
    reason: '牙科复诊，需请假半天', status: '待审批', approveRemark: null,
    contactPhone: '13800009999', createdAt: '2026-06-14' },
]

export const MOCK_ACTIVITIES = [
  { id: 1, title: '春季运动会', activityType: '文体活动',
    description: '一年一度的校运动会，包含田径、球类、趣味比赛等多项赛事。欢迎家长到场观赛加油！',
    location: '学校操场', startTime: '2026-06-20 08:00', endTime: '2026-06-20 16:00',
    registrationDeadline: '2026-06-18', maxParticipants: 0, currentCount: 86,
    status: '报名中', coverImage: '' },
  { id: 2, title: '期末家长会', activityType: '家长会',
    description: '各班班主任汇报本学期学生学习情况和班级工作，发放期末成绩单和档案。',
    location: '各班级教室', startTime: '2026-07-05 14:00', endTime: '2026-07-05 16:00',
    registrationDeadline: null, maxParticipants: 0, currentCount: 0,
    status: '报名中', coverImage: '' },
  { id: 3, title: '校园科技节', activityType: '比赛',
    description: '面向3-6年级学生，设有机器人编程、科学小实验、创意发明三个赛项。',
    location: '科学实验室', startTime: '2026-06-25 09:00', endTime: '2026-06-25 17:00',
    registrationDeadline: '2026-06-20', maxParticipants: 50, currentCount: 28,
    status: '报名中', coverImage: '' },
  { id: 4, title: '暑期社会实践', activityType: '社会实践',
    description: '组织学生参观市科技馆和自然博物馆，培养科学兴趣和探索精神。',
    location: '市科技馆', startTime: '2026-07-15 08:00', endTime: '2026-07-15 16:30',
    registrationDeadline: '2026-07-10', maxParticipants: 40, currentCount: 15,
    status: '报名中', coverImage: '' },
  { id: 5, title: '校园开放日', activityType: '开放日',
    description: '面向即将入学的新生及家长，参观校园环境、了解教学理念和课程设置。',
    location: '学校礼堂', startTime: '2026-06-28 09:00', endTime: '2026-06-28 12:00',
    registrationDeadline: null, maxParticipants: 0, currentCount: 0,
    status: '报名中', coverImage: '' },
]

export const MOCK_ARCHIVES = [
  { id: 1, studentId: '1', archiveType: '期末档案', semesterName: '2025-2026学年第一学期',
    summary: '综合表现优秀。出勤率98.5%，数学英语突出。获三好学生、数学竞赛一等奖。建议加强语文阅读量。',
    attendanceRate: 98.5, totalScore: 91.3, rank: 5, isPublished: true },
  { id: 2, studentId: '1', archiveType: '期末档案', semesterName: '2024-2025学年第二学期',
    summary: '表现良好，数学成绩进步明显。获小小书法家称号。课间活动积极参与，与同学关系融洽。',
    attendanceRate: 96.2, totalScore: 88.7, rank: 8, isPublished: true },
]

export const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'NEW_EVALUATION', title: '李老师发布了数学评语', brief: '点击查看最新课堂表现评价',
    isRead: false, createdAt: '2026-06-10 14:30', studentId: '1',
    dataJson: '{"actionUrl":"/evaluations?highlight=1"}' },
  { id: 2, type: 'TASK_REMINDER', title: '任务即将截止提醒', brief: '「跳绳200个」截止日期6月15日，尚未完成',
    isRead: false, createdAt: '2026-06-14 08:00', studentId: '1',
    dataJson: '{"actionUrl":"/tasks/1"}' },
  { id: 3, type: 'LEAVE_APPROVED', title: '请假申请已批准', brief: '5月10-11日病假已审批通过',
    isRead: true, createdAt: '2026-05-10 09:15', studentId: '1',
    dataJson: '{"actionUrl":"/leaves/1"}' },
  { id: 4, type: 'ACTIVITY_NEW', title: '新活动：春季运动会', brief: '文体活动，报名截止6月18日',
    isRead: false, createdAt: '2026-06-12 10:00', studentId: null,
    dataJson: '{"actionUrl":"/activities/1"}' },
  { id: 5, type: 'ARCHIVE_PUBLISHED', title: '上学期档案已发布', brief: '点击查看学期综合评价',
    isRead: true, createdAt: '2026-03-10 16:00', studentId: '1',
    dataJson: '{"actionUrl":"/archives/1"}' },
]

// ============================================================
// 智能匹配: 多关键词、多意图、模糊意图
// ============================================================

export function mockAgentQuery(query: string): AgentResponse {
  const q = query

  // 关键词权重打分
  const scores: Record<string, number> = {}
  const add = (cat: string, weight: number) => { scores[cat] = (scores[cat] || 0) + weight }

  // === 评语 ===
  if (/评语|评价|表现/.test(q)) add('eval', 30)
  if (/数学|语文|英语|物理|化学/.test(q)) add('eval', 15)
  if (/怎么样|如何|好吗/.test(q)) add('eval', 10)
  if (/老师.{0,4}(?:说|评价|评)/.test(q)) add('eval', 25)
  if (/上课|课堂|听讲|发言|考试|测试|成绩|进步|退步|注意力/.test(q)) add('eval', 20)

  // === 荣誉 ===
  if (/荣誉|奖状|证书|获奖|奖项|表扬|三好|优秀/.test(q)) add('honor', 30)
  if (/获得了?什么/.test(q) && /奖|荣誉/.test(q)) add('honor', 20)

  // === 任务 ===
  if (/任务|打卡|作业/.test(q)) add('task', 30)
  if (/完成.{0,3}[了吗呢]|做了?.{0,2}[吗没]/.test(q)) add('task', 20)
  if (/跳绳|阅读|家务|练字|口算|背/.test(q)) add('task', 15)
  if (/帮.{0,4}打卡|确认.*完成/.test(q)) add('task', 25)

  // === 请假 ===
  if (/请假|假条|病假|事假|公假/.test(q)) add('leave', 30)
  if (/审批|通过|驳回/.test(q)) add('leave', 15)
  if (/我要请假|提交请假/.test(q)) add('leave', 35)

  // === 活动 ===
  if (/活动|运动会|家长会|开放日|讲座|比赛|演出/.test(q)) add('activity', 30)
  if (/报名|参加.{0,4}活动/.test(q)) add('activity', 20)
  if (/什么时候|在哪|怎么报名/.test(q)) add('activity', 10)

  // === 档案 ===
  if (/档案|上学|历史|回顾|总结/.test(q)) add('archive', 30)
  if (/上个学期|上一年|之前/.test(q)) add('archive', 25)
  if (/排名|出勤|成绩单/.test(q)) add('archive', 15)

  // === 综合 ===
  if (/最近.{0,3}(?:情况|表现|怎么样|如何|还好)/.test(q)) add('overview', 20)
  if (/(?:给我|帮我|来).{0,3}(?:讲讲|说说|看看|介绍一下)/.test(q)) add('overview', 25)
  if (/在学校.{0,4}(?:表现|情况|状态)/.test(q)) add('overview', 20)

  // 收集匹配的类别（分数>0），按分数排序
  const matched = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])

  if (matched.length === 0) {
    return buildOverviewResponse(q)
  }

  // 取 top 2 意图（多意图）
  const topIntents = matched.slice(0, 2)
  return buildMultiIntentResponse(topIntents.map(([cat]) => cat), q)
}

// ============================================================
// 响应构建
// ============================================================

function buildMultiIntentResponse(categories: string[], query: string): AgentResponse {
  const segments = categories.map((cat) => buildSegment(cat))
  const intents = categories.map((cat) => ({
    type: catToIntentType(cat),
    confidence: 0.85 + Math.random() * 0.1,
    tool: catToTool(cat),
  }))

  // 生成综合摘要
  const texts = segments.map((s) => s.responseText).filter(Boolean)
  const summary = texts.length > 1
    ? '我帮你查了以下几个方面的信息：\n\n' + texts.map((t, i) => `${i + 1}. ${t}`).join('\n')
    : texts[0] || '没有找到相关信息。'

  // 根据已有意图推荐未覆盖的
  const allCats = ['eval', 'honor', 'task', 'leave', 'activity', 'archive']
  const remaining = allCats.filter((c) => !categories.includes(c))
  const suggestions = remaining.slice(0, 3).map(catToSuggestion)

  return {
    sessionId: 'mock-sess-' + Date.now(),
    intents,
    segments,
    summary,
    suggestions,
    elapsedMs: 80 + Math.floor(Math.random() * 120),
  }
}

function buildSegment(cat: string): AgentResponse['segments'][0] {
  switch (cat) {
    case 'eval': return buildEvalSegment()
    case 'honor': return buildHonorSegment()
    case 'task': return buildTaskSegment()
    case 'leave': return buildLeaveSegment()
    case 'activity': return buildActivitySegment()
    case 'archive': return buildArchiveSegment()
    case 'overview': return buildOverviewSegment()
    default: return buildOverviewSegment()
  }
}

// ============================================================
// 各模块 Segment 构建
// ============================================================

function buildEvalSegment() {
  const records = MOCK_EVALUATIONS.filter((e) => e.studentId === '1')
  const latest = records.slice(0, 3)
  const subjects = [...new Set(latest.map((e) => e.subject))].join('、')

  return {
    intent: 'QUERY_EVALUATION',
    tool: 'query_evaluations',
    result: { records: latest, total: records.length },
    responseText: `最近有${latest.length}条新评语，涵盖${subjects}等科目。` +
      latest.map((e) => `\n· ${e.teacherName}（${e.subject}）：${e.content.slice(0, 40)}...`).join(''),
    suggestedActions: [
      { label: '查看全部评语', url: '/evaluations', type: 'navigate' },
    ],
  }
}

function buildHonorSegment() {
  const records = MOCK_HONORS.filter((h) => h.studentId === '1')
  return {
    intent: 'QUERY_HONOR',
    tool: 'query_honors',
    result: { records, total: records.length },
    responseText: `小明共获得${records.length}项荣誉：` +
      records.map((h) => `\n· ${h.name}（${h.honorLevel}）— ${h.grantDate}`).join(''),
    suggestedActions: [
      { label: '查看荣誉墙', url: '/honors', type: 'navigate' },
    ],
  }
}

function buildTaskSegment() {
  const records = MOCK_TASKS.filter((t) => t.studentId === '1')
  const pending = records.filter((t) => t.status !== '已完成')
  return {
    intent: 'QUERY_TASK',
    tool: 'query_tasks',
    result: { records, total: records.length },
    responseText: `小明共有${records.length}项任务，已完成${records.length - pending.length}项。` +
      (pending.length > 0
        ? `还有${pending.length}项待完成：` + pending.map((t) => `\n· ${t.title}（截止${t.dueDate}）`).join('')
        : '全部任务已完成！'),
    suggestedActions: pending.length > 0
      ? [
          { label: '去打卡', url: '/tasks', type: 'action' },
          { label: '查看全部任务', url: '/tasks', type: 'navigate' },
        ]
      : [{ label: '查看全部任务', url: '/tasks', type: 'navigate' }],
  }
}

function buildLeaveSegment() {
  const records = MOCK_LEAVES.filter((l) => l.studentId === '1')
  const pending = records.filter((l) => l.status === '待审批')
  return {
    intent: 'QUERY_LEAVE',
    tool: 'query_leaves',
    result: { records, total: records.length },
    responseText: `共有${records.length}条请假记录。` +
      (pending.length > 0 ? `有${pending.length}条待审批。` : '') +
      records.slice(0, 2).map((l) =>
        `\n· ${l.leaveType} ${l.startDate}~${l.endDate} — ${l.status}`).join(''),
    suggestedActions: [
      { label: '提交请假', url: '/leaves/new', type: 'action' },
      { label: '查看请假记录', url: '/leaves', type: 'navigate' },
    ],
  }
}

function buildActivitySegment() {
  const records = MOCK_ACTIVITIES.filter((a) => a.status === '报名中')
  return {
    intent: 'QUERY_ACTIVITY',
    tool: 'query_activities',
    result: { records, total: records.length },
    responseText: `近期有${records.length}个活动可以参加：` +
      records.map((a) => `\n· ${a.title}（${a.activityType}）— ${a.startTime.slice(0, 10)}` +
        (a.registrationDeadline ? `，报名截止${a.registrationDeadline.slice(0, 10)}` : '')).join(''),
    suggestedActions: [
      { label: '查看活动详情', url: '/activities', type: 'navigate' },
    ],
  }
}

function buildArchiveSegment() {
  const records = MOCK_ARCHIVES.filter((a) => a.studentId === '1')
  return {
    intent: 'QUERY_ARCHIVE',
    tool: 'query_archive',
    result: { records, total: records.length },
    responseText: `共有${records.length}份档案：` +
      records.map((a) => `\n· ${a.semesterName} — ${a.archiveType}（排名第${a.rank}，均分${a.totalScore}）`).join(''),
    suggestedActions: [
      { label: '查看完整档案', url: '/archives', type: 'navigate' },
    ],
  }
}

function buildOverviewSegment() {
  const evals = MOCK_EVALUATIONS.filter((e) => e.studentId === '1')
  const tasks = MOCK_TASKS.filter((t) => t.studentId === '1')
  const honors = MOCK_HONORS.filter((h) => h.studentId === '1')
  const pending = tasks.filter((t) => t.status !== '已完成')

  return {
    intent: 'QUERY_OVERVIEW',
    tool: 'query_overview',
    result: {
      recentEvaluations: evals.slice(0, 3),
      pendingTasks: pending.length,
      recentHonors: honors.slice(0, 3),
      recentLeaves: MOCK_LEAVES.filter((l) => l.studentId === '1'),
      upcomingActivities: MOCK_ACTIVITIES.filter((a) => a.status === '报名中'),
    },
    responseText: `小明最近表现不错！收到了${evals.length}条新评语，涵盖语数英等科目。` +
      `有${pending.length}项任务待完成，已获得${honors.length}项荣誉。`,
    suggestedActions: [
      { label: '查看评语详情', url: '/evaluations', type: 'navigate' },
      { label: '去打卡任务', url: '/tasks', type: 'action' },
      { label: '查看荣誉墙', url: '/honors', type: 'navigate' },
    ],
  }
}

function buildOverviewResponse(query: string): AgentResponse {
  const seg = buildOverviewSegment()
  return {
    sessionId: 'mock-sess-' + Date.now(),
    intents: [{ type: 'QUERY_OVERVIEW', confidence: 0.88, tool: 'query_overview' }],
    segments: [seg],
    summary: '这是小明近期的综合情况，包括评语、任务、荣誉、活动和请假记录。',
    suggestions: ['最近数学怎么样？', '有什么任务需要完成？', '获得了哪些荣誉？', '近期有什么活动？'],
    elapsedMs: 100,
  }
}

// ============================================================
// 工具函数
// ============================================================

function catToIntentType(cat: string): string {
  const m: Record<string, string> = {
    eval: 'QUERY_EVALUATION', honor: 'QUERY_HONOR', task: 'QUERY_TASK',
    leave: 'QUERY_LEAVE', activity: 'QUERY_ACTIVITY', archive: 'QUERY_ARCHIVE',
    overview: 'QUERY_OVERVIEW',
  }
  return m[cat] || 'QUERY_OVERVIEW'
}

function catToTool(cat: string): string {
  const m: Record<string, string> = {
    eval: 'query_evaluations', honor: 'query_honors', task: 'query_tasks',
    leave: 'query_leaves', activity: 'query_activities', archive: 'query_archive',
    overview: 'query_overview',
  }
  return m[cat] || 'query_overview'
}

function catToSuggestion(cat: string): string {
  const m: Record<string, string> = {
    eval: '最近老师有什么评语？', honor: '这学期获得了哪些荣誉？',
    task: '有什么任务需要完成？', leave: '查看请假记录',
    activity: '最近有什么活动？', archive: '查看历史档案',
  }
  return m[cat] || ''
}
