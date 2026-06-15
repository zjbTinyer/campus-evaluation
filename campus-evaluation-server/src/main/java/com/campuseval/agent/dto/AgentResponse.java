package com.campuseval.agent.dto;

import java.util.List;
import java.util.Map;

/**
 * Agent 查询响应 — 前端渲染此结构
 */
public class AgentResponse {

    /** 会话ID */
    private String sessionId;

    /** 识别出的意图列表 */
    private List<IntentItem> intents;

    /** 各意图对应的查询结果分段 */
    private List<Segment> segments;

    /** 综合摘要文本（NL 生成） */
    private String summary;

    /** 追问建议 */
    private List<String> suggestions;

    /** 响应耗时（ms） */
    private Long elapsedMs;

    // -- Inner types --

    public static class IntentItem {
        private String type;         // 意图类型: QUERY_EVALUATION 等
        private Double confidence;   // 置信度 0-1
        private String tool;         // 匹配的 Tool 名称

        public IntentItem() {}
        public IntentItem(String type, Double confidence, String tool) {
            this.type = type;
            this.confidence = confidence;
            this.tool = tool;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }
        public String getTool() { return tool; }
        public void setTool(String tool) { this.tool = tool; }
    }

    public static class Segment {
        private String intent;       // 意图类型
        private String tool;         // 使用的 Tool
        private Object result;       // Tool 返回的原始数据
        private String responseText; // NL 生成的回复文本
        private List<Action> suggestedActions;

        public String getIntent() { return intent; }
        public void setIntent(String intent) { this.intent = intent; }
        public String getTool() { return tool; }
        public void setTool(String tool) { this.tool = tool; }
        public Object getResult() { return result; }
        public void setResult(Object result) { this.result = result; }
        public String getResponseText() { return responseText; }
        public void setResponseText(String responseText) { this.responseText = responseText; }
        public List<Action> getSuggestedActions() { return suggestedActions; }
        public void setSuggestedActions(List<Action> suggestedActions) { this.suggestedActions = suggestedActions; }
    }

    public static class Action {
        private String label;
        private String url;
        private String type;         // navigate / action / confirm

        public Action() {}
        public Action(String label, String url, String type) {
            this.label = label;
            this.url = url;
            this.type = type;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }

    // -- Getters & Setters --

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public List<IntentItem> getIntents() { return intents; }
    public void setIntents(List<IntentItem> intents) { this.intents = intents; }
    public List<Segment> getSegments() { return segments; }
    public void setSegments(List<Segment> segments) { this.segments = segments; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public Long getElapsedMs() { return elapsedMs; }
    public void setElapsedMs(Long elapsedMs) { this.elapsedMs = elapsedMs; }
}
