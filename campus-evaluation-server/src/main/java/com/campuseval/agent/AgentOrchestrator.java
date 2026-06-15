package com.campuseval.agent;

import com.campuseval.agent.dto.AgentRequest;
import com.campuseval.agent.dto.AgentResponse;
import com.campuseval.agent.dto.AgentResponse.*;
import com.campuseval.agent.dto.ToolResult;
import com.campuseval.agent.tools.AgentTool;
import com.campuseval.common.constant.IntentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Agent 编排器 — NL Search Agent 的中枢神经
 *
 * 实现完整状态机:
 *   IDLE → INPUT → INTENT_CLASSIFY → ENTITY_EXTRACT
 *        → TOOL_SELECT → TOOL_EXECUTE(并行) → RESULT_AGGREGATE
 *        → RESPONSE_GENERATE → IDLE
 *
 * 可靠性设计:
 * - LLM 调用超时 3s，超时降级到正则匹配
 * - 每个 Tool 独立超时 5s，单个失败不影响其他 Tool
 * - WRITE 操作必须有确认标记（由前端处理确认弹窗）
 */
@Component
public class AgentOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(AgentOrchestrator.class);

    private final IntentClassifier intentClassifier;
    private final EntityExtractor entityExtractor;
    private final ToolRegistry toolRegistry;
    private final ContextManager contextManager;
    private final ResponseGenerator responseGenerator;

    /** Tool 执行线程池 */
    private final ExecutorService toolExecutor = Executors.newFixedThreadPool(4);

    public AgentOrchestrator(IntentClassifier intentClassifier,
                             EntityExtractor entityExtractor,
                             ToolRegistry toolRegistry,
                             ContextManager contextManager,
                             ResponseGenerator responseGenerator) {
        this.intentClassifier = intentClassifier;
        this.entityExtractor = entityExtractor;
        this.toolRegistry = toolRegistry;
        this.contextManager = contextManager;
        this.responseGenerator = responseGenerator;
    }

    /**
     * 主入口 — 处理自然语言查询
     *
     * @param request  用户请求
     * @param parentId  当前登录家长ID
     */
    public AgentResponse process(AgentRequest request, Long parentId) {
        long startTime = System.currentTimeMillis();
        log.info("[Agent] 收到查询: parentId={}, query=\"{}\"", parentId, request.getQuery());

        // 1. 获取/创建会话上下文
        ContextManager.SessionContext ctx = contextManager.getOrCreate(request.getSessionId(), parentId);

        // 2. 意图分类 (Tier1: 正则, Tier2: LLM)
        IntentClassifier.ClassificationResult classification = intentClassifier.classify(request.getQuery());

        // 3. 实体提取
        EntityExtractor.EntityResult entities = entityExtractor.extract(request.getQuery());

        // 4. 解析学生
        String studentId = resolveStudent(request, ctx, entities);
        if (studentId == null) {
            // 歧义：需要用户选择学生
            return buildAmbiguousStudentResponse(request, ctx, entities);
        }

        // 5. 选择 Tool
        List<String> toolNames = selectTools(classification, request);

        // 6. 构建参数并执行 Tool（并行）
        Map<String, Object> baseParams = buildBaseParams(studentId, entities);
        List<ToolResult> toolResults = executeTools(toolNames, baseParams, request.getQuery());

        // 7. 结果聚合
        List<Segment> segments = aggregateResults(classification, toolResults);

        // 8. 生成回复（NL + 建议动作）
        String summary = responseGenerator.generateSummary(request.getQuery(), segments);
        List<String> suggestions = responseGenerator.generateSuggestions(request.getQuery(), classification);

        // 9. 追加对话历史
        contextManager.appendHistory("user", request.getQuery());
        contextManager.appendHistory("assistant", summary);

        AgentResponse response = new AgentResponse();
        response.setSessionId(ctx.getSessionId());
        response.setIntents(classification.intents);
        response.setSegments(segments);
        response.setSummary(summary);
        response.setSuggestions(suggestions);
        response.setElapsedMs(System.currentTimeMillis() - startTime);

        log.info("[Agent] 查询完成: {}ms, intents={}, segments={}",
                response.getElapsedMs(), classification.intents.size(), segments.size());

        return response;
    }

    // ====================================================================
    // Private methods
    // ====================================================================

    /**
     * 解析目标学生
     * @return 学生ID，null 表示歧义需要澄清
     */
    private String resolveStudent(AgentRequest request, ContextManager.SessionContext ctx,
                                   EntityExtractor.EntityResult entities) {
        // 1. 请求中明确指定
        if (request.getStudentId() != null && !request.getStudentId().isEmpty()) {
            return request.getStudentId();
        }
        // 2. 上下文默认学生
        if (ctx.getCurrentStudentId() != null) {
            return ctx.getCurrentStudentId();
        }
        // 3. 无学生
        return null;
    }

    /**
     * 选择要执行的 Tool 列表
     */
    private List<String> selectTools(IntentClassifier.ClassificationResult classification,
                                      AgentRequest request) {
        if (classification.intents.isEmpty()) {
            // 无意图匹配 → 默认查概览
            return Collections.singletonList("query_overview");
        }

        List<String> tools = new ArrayList<>();
        for (IntentItem intent : classification.intents) {
            String toolName = intent.getTool();
            if (toolName != null && !tools.contains(toolName)) {
                tools.add(toolName);
            }
        }
        return tools;
    }

    /**
     * 构建 Tool 调用参数（从实体提取结果映射）
     */
    private Map<String, Object> buildBaseParams(String studentId, EntityExtractor.EntityResult entities) {
        Map<String, Object> params = new HashMap<>();
        params.put("student_ids", Collections.singletonList(studentId));

        if (entities.subject != null) {
            params.put("subjects", Collections.singletonList(entities.subject));
        }
        if (entities.timeRange != null) {
            params.put("date_from", entities.timeRange.getDateFrom());
            params.put("date_to", entities.timeRange.getDateTo());
        }
        if (entities.semester != null) {
            params.put("semester", entities.semester);
        }
        if (entities.keyword != null) {
            params.put("keyword", entities.keyword);
        }

        return params;
    }

    /**
     * 并行执行多个 Tool
     */
    private List<ToolResult> executeTools(List<String> toolNames, Map<String, Object> params, String query) {
        if (toolNames.isEmpty()) return Collections.emptyList();

        // WRITE 操作不能与其他操作并行（需要确认 + 顺序执行）
        boolean hasWrite = toolNames.stream().anyMatch(this::isWriteTool);

        if (hasWrite) {
            // WRITE 工具串行执行，且只执行第一个
            String writeTool = toolNames.stream().filter(this::isWriteTool).findFirst().orElse(null);
            if (writeTool != null) {
                ToolResult result = executeOneTool(writeTool, params);
                return Collections.singletonList(result);
            }
        }

        // READ 工具并行执行
        List<CompletableFuture<ToolResult>> futures = toolNames.stream()
                .filter(name -> !isWriteTool(name))
                .map(name -> CompletableFuture.supplyAsync(() -> executeOneTool(name, params), toolExecutor)
                        .orTimeout(5, TimeUnit.SECONDS)
                        .exceptionally(ex -> ToolResult.fail(name, "执行超时或异常: " + ex.getMessage())))
                .collect(Collectors.toList());

        return futures.stream()
                .map(f -> {
                    try { return f.get(6, TimeUnit.SECONDS); }
                    catch (Exception e) { return ToolResult.fail("unknown", "Tool执行异常: " + e.getMessage()); }
                })
                .collect(Collectors.toList());
    }

    /**
     * 执行单个 Tool
     */
    private ToolResult executeOneTool(String toolName, Map<String, Object> params) {
        long start = System.currentTimeMillis();
        AgentTool tool = toolRegistry.getInstance(toolName);

        if (tool == null) {
            // Tool 未注册，返回 Mock 数据（后续替换为真实实现）
            log.warn("[Agent] Tool [{}] 未注册，返回 mock 数据", toolName);
            ToolResult mock = ToolResult.ok(toolName,
                    Collections.singletonList("Mock 数据 — Tool [" + toolName + "] 待实现"), 1L);
            mock.setElapsedMs(0L);
            return mock;
        }

        try {
            ToolResult result = tool.execute(params);
            result.setElapsedMs(System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("[Agent] Tool [{}] 执行失败", toolName, e);
            return ToolResult.fail(toolName, e.getMessage());
        }
    }

    private boolean isWriteTool(String toolName) {
        return "checkin_task".equals(toolName)
                || "submit_leave".equals(toolName)
                || "register_activity".equals(toolName);
    }

    /**
     * 聚合 Tool 结果为 Segments
     */
    private List<Segment> aggregateResults(IntentClassifier.ClassificationResult classification,
                                            List<ToolResult> toolResults) {
        List<Segment> segments = new ArrayList<>();

        for (ToolResult result : toolResults) {
            Segment seg = new Segment();
            seg.setTool(result.getToolName());
            seg.setResult(result.getData());

            // 生成 NL 回复文本
            seg.setResponseText(responseGenerator.generateSegmentText(result));

            // 生成建议动作
            seg.setSuggestedActions(buildSuggestedActions(result));

            segments.add(seg);
        }

        return segments;
    }

    /**
     * 根据 Tool 结果生成建议动作
     */
    private List<Action> buildSuggestedActions(ToolResult result) {
        List<Action> actions = new ArrayList<>();

        switch (result.getToolName()) {
            case "query_evaluations":
                actions.add(new Action("查看全部评语", "/evaluations", "navigate"));
                break;
            case "query_honors":
                actions.add(new Action("查看全部荣誉", "/honors", "navigate"));
                break;
            case "query_tasks":
                actions.add(new Action("查看全部任务", "/tasks", "navigate"));
                actions.add(new Action("去打卡", "/tasks?action=checkin", "action"));
                break;
            case "query_leaves":
                actions.add(new Action("提交请假", "/leaves/new", "action"));
                break;
            case "query_activities":
                actions.add(new Action("查看活动详情", "/activities", "navigate"));
                break;
            case "query_archive":
                actions.add(new Action("查看完整档案", "/archives", "navigate"));
                break;
            default:
                break;
        }

        return actions;
    }

    /**
     * 学生歧义时的响应
     */
    private AgentResponse buildAmbiguousStudentResponse(AgentRequest request,
                                                         ContextManager.SessionContext ctx,
                                                         EntityExtractor.EntityResult entities) {
        AgentResponse response = new AgentResponse();
        response.setSessionId(ctx.getSessionId());
        response.setSummary("请问您想查看哪个孩子的情况？");

        List<Action> options = new ArrayList<>();
        for (Map<String, Object> s : ctx.getLinkedStudents()) {
            options.add(new Action(
                    s.get("name").toString(),
                    "?student=" + s.get("id"),
                    "confirm"
            ));
        }

        Segment seg = new Segment();
        seg.setSuggestedActions(options);
        response.setSegments(Collections.singletonList(seg));

        return response;
    }
}
