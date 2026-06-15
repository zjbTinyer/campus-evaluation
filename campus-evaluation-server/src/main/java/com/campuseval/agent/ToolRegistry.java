package com.campuseval.agent;

import com.campuseval.agent.dto.ToolDefinition;
import com.campuseval.agent.tools.AgentTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tool 注册中心 — 管理所有 Tool 的定义和实例
 *
 * 初始化时注册 10 个 Tool 的 JSON Schema 定义。
 * Tool 实例通过 Spring DI 注入后注册。
 */
@Component
public class ToolRegistry {

    private static final Logger log = LoggerFactory.getLogger(ToolRegistry.class);

    /** Tool 定义缓存（name → ToolDefinition） */
    private final Map<String, ToolDefinition> definitions = new LinkedHashMap<>();

    /** Tool 实例缓存（name → AgentTool） */
    private final Map<String, AgentTool> instances = new ConcurrentHashMap<>();

    public ToolRegistry() {
        // 注册 10 个 Tool 的 JSON Schema 定义
        for (AgentConstants.ToolDef def : AgentConstants.ALL_TOOLS) {
            definitions.put(def.name, new ToolDefinition(
                    def.name, def.description, def.actionType, def.parameters,
                    extractRequired(def.parameters)
            ));
        }
        log.info("ToolRegistry: 已注册 {} 个 Tool 定义", definitions.size());
    }

    /**
     * 注册 Tool 实例（由 Spring Bean 初始化后调用）
     */
    public void registerInstance(AgentTool tool) {
        instances.put(tool.getName(), tool);
        log.info("ToolRegistry: Tool [{}] 实例已注册", tool.getName());
    }

    /**
     * 获取 Tool 定义
     */
    public ToolDefinition getDefinition(String toolName) {
        return definitions.get(toolName);
    }

    /**
     * 获取所有 Tool 定义（给 LLM 看）
     */
    public List<ToolDefinition> getAllDefinitions() {
        return new ArrayList<>(definitions.values());
    }

    /**
     * 获取 Tool 实例
     */
    public AgentTool getInstance(String toolName) {
        AgentTool tool = instances.get(toolName);
        if (tool == null) {
            log.warn("Tool [{}] 实例未注册", toolName);
        }
        return tool;
    }

    /**
     * 根据意图类型获取对应的 Tool 名称列表
     */
    public List<String> getToolNamesByIntent(String intentType) {
        String toolName = IntentClassifier.intentToTool(intentType);
        return toolName != null ? Collections.singletonList(toolName) : Collections.emptyList();
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRequired(Map<String, Object> params) {
        Object required = params.get("required");
        if (required instanceof List) {
            return (List<String>) required;
        }
        return Collections.emptyList();
    }
}
