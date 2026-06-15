package com.campuseval.agent;

import com.campuseval.agent.dto.AgentResponse.Segment;
import com.campuseval.agent.dto.ToolResult;
import com.campuseval.llm.LLMClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 回复生成器 — 负责生成自然的 NL 回复文本和追问建议
 *
 * 策略：
 * 1. 简单结果（单条/少量数据）→ 模板生成（零延迟）
 * 2. 复杂结果（多条/模糊查询）→ LLM 生成（通义千问/DeepSeek）
 */
@Component
public class ResponseGenerator {

    private static final Logger log = LoggerFactory.getLogger(ResponseGenerator.class);

    private final LLMClient llmClient;

    public ResponseGenerator(LLMClient llmClient) {
        this.llmClient = llmClient;
    }

    /**
     * 为每个 Segment 生成 NL 回复文本
     */
    public String generateSegmentText(ToolResult result) {
        if (!result.isSuccess()) {
            return "抱歉，" + result.getToolName() + "查询失败了：" + result.getErrorMessage();
        }

        Object data = result.getData();
        long total = result.getTotal() != null ? result.getTotal() : 0;

        switch (result.getToolName()) {
            case "query_evaluations":
                return buildEvaluationText(data, total);
            case "query_honors":
                return buildHonorText(data, total);
            case "query_tasks":
                return buildTaskText(data, total);
            case "query_leaves":
                return buildLeaveText(data, total);
            case "query_activities":
                return buildActivityText(data, total);
            case "query_archive":
                return buildArchiveText(data, total);
            case "query_overview":
                return buildOverviewText(data);
            case "checkin_task":
                return "✅ 打卡成功！任务已完成确认。";
            case "submit_leave":
                return "请假申请已提交，请等待班主任审批。";
            case "register_activity":
                return "活动报名成功！请关注活动时间。";
            default:
                return null;
        }
    }

    /**
     * 生成综合摘要
     */
    public String generateSummary(String query, List<Segment> segments) {
        if (segments.isEmpty()) {
            return "没有找到相关信息。您可以换个方式描述，或者点击下方按钮浏览具体内容。";
        }

        // 简单场景用模板拼接
        List<String> texts = segments.stream()
                .map(Segment::getResponseText)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (texts.isEmpty()) return "已查到相关信息，请查看详情。";
        return String.join("\n\n", texts);
    }

    /**
     * 生成追问建议
     */
    public List<String> generateSuggestions(String query,
                                             IntentClassifier.ClassificationResult classification) {
        // 根据意图类型智能推荐追问
        List<String> suggestions = new ArrayList<>();

        boolean hasEval = classification.intents.stream().anyMatch(i -> i.getType().contains("EVALUATION"));
        boolean hasTask = classification.intents.stream().anyMatch(i -> i.getType().contains("TASK"));
        boolean hasHonor = classification.intents.stream().anyMatch(i -> i.getType().contains("HONOR"));

        if (!hasEval) suggestions.add("最近老师有什么评语？");
        if (!hasTask) suggestions.add("有什么任务需要完成？");
        if (!hasHonor) suggestions.add("这学期获得了哪些荣誉？");
        suggestions.add("查看历史档案");

        return suggestions.size() > 3 ? suggestions.subList(0, 3) : suggestions;
    }

    // -- Private template builders --

    @SuppressWarnings("unchecked")
    private String buildEvaluationText(Object data, long total) {
        if (total == 0) return "暂时没有找到相关的评语记录。要不要看看其他科目？";
        if (data instanceof List && !((List<?>) data).isEmpty()) {
            // 简单模板：取第一条评语生成摘要
            Map<String, Object> first = (Map<String, Object>) ((List<?>) data).get(0);
            String teacher = String.valueOf(first.getOrDefault("teacherName", "老师"));
            String subject = String.valueOf(first.getOrDefault("subject", ""));
            String content = String.valueOf(first.getOrDefault("content", ""));
            String snippet = content.length() > 60 ? content.substring(0, 60) + "..." : content;
            return String.format("%s老师%s评语：%s（共%d条记录）", teacher, subject, snippet, total);
        }
        return String.format("共有%d条评语记录。", total);
    }

    @SuppressWarnings("unchecked")
    private String buildHonorText(Object data, long total) {
        if (total == 0) return "暂时没有相关的荣誉记录。继续加油！";
        if (data instanceof List && !((List<?>) data).isEmpty()) {
            Map<String, Object> first = (Map<String, Object>) ((List<?>) data).get(0);
            String name = String.valueOf(first.getOrDefault("name", ""));
            String level = String.valueOf(first.getOrDefault("honorLevel", ""));
            return String.format("最新荣誉：%s（%s）。共%d项荣誉。", name, level, total);
        }
        return String.format("共有%d项荣誉。", total);
    }

    @SuppressWarnings("unchecked")
    private String buildTaskText(Object data, long total) {
        if (total == 0) return "暂时没有任务记录。";
        if (data instanceof List && !((List<?>) data).isEmpty()) {
            List<Map<String, Object>> tasks = (List<Map<String, Object>>) data;
            long completed = tasks.stream().filter(t -> "已完成".equals(t.get("status"))).count();
            long pending = tasks.size() - completed;
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("共有%d项任务，已完成%d项", tasks.size(), completed));
            if (pending > 0) {
                sb.append(String.format("，还有%d项待完成", pending));
                // 列出待完成的任务
                tasks.stream()
                    .filter(t -> !"已完成".equals(t.get("status")))
                    .forEach(t -> sb.append("\n· ").append(t.get("title")));
            }
            return sb.toString();
        }
        return String.format("共有%d项任务。", total);
    }

    @SuppressWarnings("unchecked")
    private String buildLeaveText(Object data, long total) {
        if (total == 0) return "没有请假记录。";
        if (data instanceof List && !((List<?>) data).isEmpty()) {
            Map<String, Object> first = (Map<String, Object>) ((List<?>) data).get(0);
            String status = String.valueOf(first.getOrDefault("status", ""));
            return String.format("最近一条请假申请状态：%s。共%d条记录。", status, total);
        }
        return String.format("共有%d条请假记录。", total);
    }

    @SuppressWarnings("unchecked")
    private String buildActivityText(Object data, long total) {
        if (total == 0) return "近期没有活动通知。";
        if (data instanceof List && !((List<?>) data).isEmpty()) {
            Map<String, Object> first = (Map<String, Object>) ((List<?>) data).get(0);
            String title = String.valueOf(first.getOrDefault("title", ""));
            return String.format("最新活动：%s。共%d个活动。", title, total);
        }
        return String.format("共有%d个活动。", total);
    }

    private String buildArchiveText(Object data, long total) {
        if (total == 0) return "还没有发布的历史档案。";
        return String.format("共有%d份档案记录。", total);
    }

    private String buildOverviewText(Object data) {
        return "以下是孩子的近期综合概览，包括最新评语、任务和活动情况。";
    }
}
