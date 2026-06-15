package com.campuseval.controller;

import com.campuseval.agent.AgentOrchestrator;
import com.campuseval.agent.ContextManager;
import com.campuseval.agent.dto.AgentRequest;
import com.campuseval.agent.dto.AgentResponse;
import com.campuseval.model.dto.UnifiedResponse;
import com.campuseval.security.CurrentUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * NL Search Agent API — 系统核心入口
 *
 * POST /api/v1/agent/query    提交自然语言查询
 * GET  /api/v1/agent/history  获取会话历史
 */
@RestController
@RequestMapping("/api/v1/agent")
public class AgentController {

    private static final Logger log = LoggerFactory.getLogger(AgentController.class);

    private final AgentOrchestrator orchestrator;
    private final ContextManager contextManager;

    public AgentController(AgentOrchestrator orchestrator, ContextManager contextManager) {
        this.orchestrator = orchestrator;
        this.contextManager = contextManager;
    }

    /**
     * 自然语言查询 — 主入口
     *
     * 示例请求:
     * {
     *   "query": "小明最近数学怎么样？任务完成了吗？",
     *   "sessionId": "sess-abc123"
     * }
     */
    @PostMapping("/query")
    public UnifiedResponse<AgentResponse> query(@Valid @RequestBody AgentRequest request,
                                                 @CurrentUser Long parentId) {
        log.info("[AgentController] query: \"{}\", parentId={}", request.getQuery(), parentId);
        AgentResponse response = orchestrator.process(request, parentId);
        return UnifiedResponse.ok(response);
    }

    /**
     * 获取 Agent 会话历史
     */
    @GetMapping("/history")
    public UnifiedResponse<?> history(@RequestParam(required = false) String sessionId,
                                       @CurrentUser Long parentId) {
        ContextManager.SessionContext ctx = contextManager.getOrCreate(sessionId, parentId);
        return UnifiedResponse.ok(Map.of(
                "sessionId", ctx.getSessionId(),
                "currentStudentId", ctx.getCurrentStudentId(),
                "linkedStudents", ctx.getLinkedStudents(),
                "history", ctx.getConversationHistory()
        ));
    }

    /**
     * 清除会话
     */
    @DeleteMapping("/history/{sessionId}")
    public UnifiedResponse<?> clearHistory(@PathVariable String sessionId) {
        contextManager.clear();
        return UnifiedResponse.ok("会话已清除");
    }

    /**
     * 切换当前学生
     */
    @PostMapping("/student/switch")
    public UnifiedResponse<?> switchStudent(@RequestParam String studentId) {
        contextManager.switchStudent(studentId);
        return UnifiedResponse.ok("已切换");
    }
}
