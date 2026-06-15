package com.campuseval.common.exception;

import com.campuseval.model.dto.UnifiedResponse;
import com.campuseval.model.dto.UnifiedResponse.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

/**
 * 全局异常处理 — 统一返回 { code, message }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public UnifiedResponse<?> handleBusiness(BusinessException e) {
        return UnifiedResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(AgentException.class)
    @ResponseStatus(HttpStatus.OK)
    public UnifiedResponse<?> handleAgent(AgentException e) {
        log.warn("[Agent] recoverable={}, detail={}", e.isRecoverable(), e.getMessage());
        return UnifiedResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.OK)
    public UnifiedResponse<?> handleValidation(Exception e) {
        String detail = "参数校验失败";
        if (e instanceof MethodArgumentNotValidException) {
            detail = ((MethodArgumentNotValidException) e).getBindingResult().getFieldError().getDefaultMessage();
        } else if (e instanceof BindException) {
            detail = ((BindException) e).getBindingResult().getFieldError().getDefaultMessage();
        }
        return UnifiedResponse.fail(ErrorCode.BAD_REQUEST, detail);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.OK)
    public UnifiedResponse<?> handleAccessDenied(AccessDeniedException e) {
        return UnifiedResponse.fail(ErrorCode.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.OK)
    public UnifiedResponse<?> handleUnknown(Exception e, HttpServletRequest request) {
        log.error("[InternalError] {} {}", request.getMethod(), request.getRequestURI(), e);
        return UnifiedResponse.fail(ErrorCode.INTERNAL_ERROR);
    }
}
