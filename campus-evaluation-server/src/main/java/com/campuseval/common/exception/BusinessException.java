package com.campuseval.common.exception;

import com.campuseval.model.dto.UnifiedResponse.ErrorCode;

/**
 * 业务异常 — 会被 GlobalExceptionHandler 统一处理
 */
public class BusinessException extends RuntimeException {

    private final Integer code;

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(ErrorCode errorCode, String detail) {
        super(errorCode.getMessage() + ": " + detail);
        this.code = errorCode.getCode();
    }

    public Integer getCode() { return code; }
}
