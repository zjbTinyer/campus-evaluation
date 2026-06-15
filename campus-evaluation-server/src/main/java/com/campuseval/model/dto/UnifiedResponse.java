package com.campuseval.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一返回体 — 所有 API 返回此格式
 * <pre>{@code
 * { "code": 0, "data": {...}, "message": "success" }
 * }</pre>
 *
 * @param <T> 数据类型
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnifiedResponse<T> {

    /** 0=成功, 4xxx=客户端错误, 5xxx=服务端错误 */
    private Integer code;
    private String message;
    private T data;

    private UnifiedResponse() {}

    // ---------- 成功 ----------

    public static <T> UnifiedResponse<T> ok(T data) {
        UnifiedResponse<T> r = new UnifiedResponse<>();
        r.code = 0;
        r.message = "success";
        r.data = data;
        return r;
    }

    public static <T> UnifiedResponse<T> ok() {
        return ok(null);
    }

    // ---------- 失败 ----------

    public static <T> UnifiedResponse<T> fail(Integer code, String message) {
        UnifiedResponse<T> r = new UnifiedResponse<>();
        r.code = code;
        r.message = message;
        return r;
    }

    public static <T> UnifiedResponse<T> fail(ErrorCode errorCode) {
        return fail(errorCode.getCode(), errorCode.getMessage());
    }

    public static <T> UnifiedResponse<T> fail(ErrorCode errorCode, String detail) {
        return fail(errorCode.getCode(), errorCode.getMessage() + ": " + detail);
    }

    // ---------- Getters ----------

    public Integer getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }

    public void setCode(Integer code) { this.code = code; }
    public void setMessage(String message) { this.message = message; }
    public void setData(T data) { this.data = data; }

    /**
     * 标准错误码枚举
     */
    public enum ErrorCode {
        SUCCESS(0, "success"),
        BAD_REQUEST(4001, "参数错误"),
        UNAUTHORIZED(4010, "未登录或登录已过期"),
        FORBIDDEN(4030, "权限不足"),
        NOT_FOUND(4040, "资源不存在"),
        CONFLICT(4090, "资源冲突"),
        INTERNAL_ERROR(5000, "服务器内部错误"),
        AGENT_TIMEOUT(5001, "AI 查询超时"),
        AGENT_INTENT_UNKNOWN(5002, "无法理解您的问题，请换个方式描述");

        private final Integer code;
        private final String message;

        ErrorCode(Integer code, String message) {
            this.code = code;
            this.message = message;
        }

        public Integer getCode() { return code; }
        public String getMessage() { return message; }
    }
}
