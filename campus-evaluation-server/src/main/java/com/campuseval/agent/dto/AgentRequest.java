package com.campuseval.agent.dto;

import javax.validation.constraints.NotBlank;

/**
 * Agent 查询请求
 */
public class AgentRequest {

    /** 用户自然语言输入 */
    @NotBlank(message = "请输入您想问的问题")
    private String query;

    /** 当前查看的学生ID，可选（不传则用 ContextManager 中的默认学生） */
    private String studentId;

    /** 会话ID，用于多轮对话上下文 */
    private String sessionId;

    /** 模式：auto=自动, search_only=仅搜索, action=仅操作 */
    private String mode = "auto";

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
