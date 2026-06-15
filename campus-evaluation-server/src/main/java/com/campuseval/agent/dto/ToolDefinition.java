package com.campuseval.agent.dto;

import java.util.List;
import java.util.Map;

/**
 * Tool 定义 — 包含严格的 JSON Schema
 */
public class ToolDefinition {

    /** Tool 唯一名称 */
    private String name;

    /** 中文描述 — 给 LLM 看的，描述何时使用此 Tool */
    private String description;

    /** 操作类型: READ / WRITE */
    private String actionType;

    /** JSON Schema parameters 节点 */
    private Map<String, Object> parameters;

    /** 必填字段列表 */
    private List<String> required;

    public ToolDefinition() {}

    public ToolDefinition(String name, String description, String actionType,
                          Map<String, Object> parameters, List<String> required) {
        this.name = name;
        this.description = description;
        this.actionType = actionType;
        this.parameters = parameters;
        this.required = required;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public Map<String, Object> getParameters() { return parameters; }
    public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
    public List<String> getRequired() { return required; }
    public void setRequired(List<String> required) { this.required = required; }
}
