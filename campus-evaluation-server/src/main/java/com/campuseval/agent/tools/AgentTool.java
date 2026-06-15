package com.campuseval.agent.tools;

import com.campuseval.agent.dto.ToolResult;

import java.util.Map;

/**
 * Agent Tool 接口 — 所有 Tool 实现此接口
 *
 * 每个 Tool 是原子化的数据访问/操作单元，有严格的输入输出契约。
 */
public interface AgentTool {

    /** Tool 唯一名称，如 "query_evaluations" */
    String getName();

    /** Tool 中文描述 */
    String getDescription();

    /** 操作类型: READ / WRITE */
    String getActionType();

    /** 执行 Tool，params 已经过 Schema 校验 */
    ToolResult execute(Map<String, Object> params);
}
