package com.campuseval.common.exception;

import com.campuseval.model.dto.UnifiedResponse.ErrorCode;

/**
 * Agent 专用异常 — 用于 NL Search Agent 各环节的异常传递
 */
public class AgentException extends RuntimeException {

    private final Integer code;
    private final boolean recoverable; // 是否可降级处理

    public AgentException(ErrorCode errorCode, String detail, boolean recoverable) {
        super(detail);
        this.code = errorCode.getCode();
        this.recoverable = recoverable;
    }

    public Integer getCode() { return code; }
    public boolean isRecoverable() { return recoverable; }
}
