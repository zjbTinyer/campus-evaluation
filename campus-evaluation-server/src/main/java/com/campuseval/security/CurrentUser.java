package com.campuseval.security;

import java.lang.annotation.*;

/**
 * 当前登录家长注解 — Controller 方法参数注入 parentId
 * <pre>
 *   @GetMapping("/profile")
 *   public Result getProfile(@CurrentUser Long parentId) { ... }
 * </pre>
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {
}
