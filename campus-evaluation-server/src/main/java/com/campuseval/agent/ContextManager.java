package com.campuseval.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 会话上下文管理 — 维护家长-学生关联、对话历史、当前选中学生
 *
 * 上下文结构（Redis存储）:
 * {
 *   "session_id": "sess-xxx",
 *   "parent_id": 1,
 *   "current_student_id": "stu-001",
 *   "linked_students": [{id, name, class, grade}, ...],
 *   "conversation_history": [{role, content, time}, ...]
 * }
 */
@Component
public class ContextManager {

    private static final Logger log = LoggerFactory.getLogger(ContextManager.class);
    private static final String SESSION_PREFIX = "agent:session:";
    private static final long SESSION_TTL_MINUTES = 30;

    private final RedisTemplate<String, Object> redisTemplate;

    // 内存中的线程本地上下文（单次请求内使用）
    private final ThreadLocal<SessionContext> threadContext = new ThreadLocal<>();

    public ContextManager(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 获取或创建会话上下文
     */
    public SessionContext getOrCreate(String sessionId, Long parentId) {
        // 优先取线程本地
        SessionContext ctx = threadContext.get();
        if (ctx != null) return ctx;

        // 尝试从 Redis 恢复
        if (sessionId != null) {
            SessionContext cached = (SessionContext) redisTemplate.opsForValue()
                    .get(SESSION_PREFIX + sessionId);
            if (cached != null) {
                threadContext.set(cached);
                return cached;
            }
        }

        // 新建上下文
        String newSessionId = sessionId != null ? sessionId : "sess-" + UUID.randomUUID().toString().substring(0, 8);
        ctx = new SessionContext();
        ctx.sessionId = newSessionId;
        ctx.parentId = parentId;
        ctx.linkedStudents = loadLinkedStudents(parentId); // 查询数据库
        if (!ctx.linkedStudents.isEmpty()) {
            ctx.currentStudentId = ctx.linkedStudents.get(0).get("id").toString();
        }
        ctx.conversationHistory = new ArrayList<>();

        threadContext.set(ctx);
        persist(ctx);
        return ctx;
    }

    /**
     * 切换当前查看的学生
     */
    public void switchStudent(String studentId) {
        SessionContext ctx = threadContext.get();
        if (ctx != null) {
            ctx.currentStudentId = studentId;
            persist(ctx);
        }
    }

    /**
     * 追加对话历史
     */
    public void appendHistory(String role, String content) {
        SessionContext ctx = threadContext.get();
        if (ctx != null) {
            ctx.conversationHistory.add(new HistoryItem(role, content, System.currentTimeMillis()));
            // 只保留最近 10 轮
            if (ctx.conversationHistory.size() > 20) {
                ctx.conversationHistory = ctx.conversationHistory
                        .subList(ctx.conversationHistory.size() - 20, ctx.conversationHistory.size());
            }
            persist(ctx);
        }
    }

    /**
     * 解析学生名称 → 匹配关联学生列表
     * @return 匹配到的学生ID，如果歧义返回 null
     */
    public String resolveStudentName(String namePart) {
        SessionContext ctx = threadContext.get();
        if (ctx == null) return null;

        List<Map<String, Object>> matched = new ArrayList<>();
        for (Map<String, Object> s : ctx.linkedStudents) {
            String sname = s.get("name").toString();
            if (sname.contains(namePart) || namePart.contains(sname)) {
                matched.add(s);
            }
        }

        if (matched.size() == 1) return matched.get(0).get("id").toString();
        if (matched.isEmpty()) return ctx.currentStudentId; // 默认当前学生
        return null; // 歧义，需要用户澄清
    }

    /**
     * 获取歧义时的学生选项列表
     */
    public List<Map<String, Object>> resolveAmbiguous(String namePart) {
        SessionContext ctx = threadContext.get();
        if (ctx == null) return Collections.emptyList();

        List<Map<String, Object>> matched = new ArrayList<>();
        for (Map<String, Object> s : ctx.linkedStudents) {
            String sname = s.get("name").toString();
            if (sname.contains(namePart) || namePart.contains(sname)) {
                matched.add(s);
            }
        }
        return matched;
    }

    public void clear() {
        SessionContext ctx = threadContext.get();
        if (ctx != null) {
            redisTemplate.delete(SESSION_PREFIX + ctx.sessionId);
        }
        threadContext.remove();
    }

    // -- private --

    private void persist(SessionContext ctx) {
        redisTemplate.opsForValue().set(SESSION_PREFIX + ctx.sessionId, ctx, SESSION_TTL_MINUTES, TimeUnit.MINUTES);
    }

    /**
     * 从数据库加载家长关联的学生列表
     * TODO: 注入 ParentStudentMapper 查询
     */
    private List<Map<String, Object>> loadLinkedStudents(Long parentId) {
        // Mock 数据 — 实际应从 parent_student JOIN student 查询
        List<Map<String, Object>> students = new ArrayList<>();
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "1");
        s1.put("name", "小明");
        s1.put("className", "三年级二班");
        s1.put("grade", 3);
        students.add(s1);
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "2");
        s2.put("name", "小红");
        s2.put("className", "一年级一班");
        s2.put("grade", 1);
        students.add(s2);
        return students;
    }

    /**
     * 会话上下文数据结构
     */
    public static class SessionContext implements java.io.Serializable {
        private String sessionId;
        private Long parentId;
        private String currentStudentId;
        private List<Map<String, Object>> linkedStudents;
        private List<HistoryItem> conversationHistory;

        public String getSessionId() { return sessionId; }
        public Long getParentId() { return parentId; }
        public String getCurrentStudentId() { return currentStudentId; }
        public List<Map<String, Object>> getLinkedStudents() { return linkedStudents; }
        public List<HistoryItem> getConversationHistory() { return conversationHistory; }
    }

    public static class HistoryItem implements java.io.Serializable {
        private String role;
        private String content;
        private Long timestamp;

        public HistoryItem() {}
        public HistoryItem(String role, String content, Long timestamp) {
            this.role = role;
            this.content = content;
            this.timestamp = timestamp;
        }

        public String getRole() { return role; }
        public String getContent() { return content; }
        public Long getTimestamp() { return timestamp; }
    }
}
