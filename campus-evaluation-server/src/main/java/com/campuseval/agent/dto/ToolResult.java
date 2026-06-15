package com.campuseval.agent.dto;

/**
 * Tool 执行结果
 */
public class ToolResult {

    /** 是否执行成功 */
    private boolean success;

    /** Tool 名称 */
    private String toolName;

    /** 返回数据 */
    private Object data;

    /** 数据总数（用于分页） */
    private Long total;

    /** 错误信息 */
    private String errorMessage;

    /** 执行耗时（ms） */
    private Long elapsedMs;

    public ToolResult() {}

    public static ToolResult ok(String toolName, Object data, Long total) {
        ToolResult r = new ToolResult();
        r.success = true;
        r.toolName = toolName;
        r.data = data;
        r.total = total;
        return r;
    }

    public static ToolResult fail(String toolName, String errorMessage) {
        ToolResult r = new ToolResult();
        r.success = false;
        r.toolName = toolName;
        r.errorMessage = errorMessage;
        return r;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    public Long getTotal() { return total; }
    public void setTotal(Long total) { this.total = total; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Long getElapsedMs() { return elapsedMs; }
    public void setElapsedMs(Long elapsedMs) { this.elapsedMs = elapsedMs; }
}
