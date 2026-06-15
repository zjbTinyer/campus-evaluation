package com.campuseval.controller;

import com.campuseval.model.dto.UnifiedResponse;
import com.campuseval.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证接口 — 手机号登录 / 微信登录
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 手机号 + 密码登录
     */
    @PostMapping("/login")
    public UnifiedResponse<Map<String, Object>> login(@Valid @RequestBody PhoneLoginRequest request) {
        // TODO: 查 parent 表验证手机号+密码，这里先返回 Mock
        // 实际项目需注入 ParentService 验证
        String token = jwtTokenProvider.generateToken(1L, request.getPhone());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400);

        return UnifiedResponse.ok(data);
    }

    /**
     * 微信 OAuth 登录
     */
    @PostMapping("/login/wechat")
    public UnifiedResponse<Map<String, Object>> wechatLogin(@Valid @RequestBody WechatLoginRequest request) {
        // TODO: 通过微信 code 换取 openid，查询或创建 parent 记录
        String token = jwtTokenProvider.generateToken(1L, "wechat_user");

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400);

        return UnifiedResponse.ok(data);
    }

    /**
     * Token 刷新
     */
    @PostMapping("/refresh")
    public UnifiedResponse<Map<String, Object>> refresh(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long parentId = jwtTokenProvider.getParentId(token);
        String newToken = jwtTokenProvider.generateToken(parentId, "");

        Map<String, Object> data = new HashMap<>();
        data.put("token", newToken);

        return UnifiedResponse.ok(data);
    }

    // -- DTOs --

    public static class PhoneLoginRequest {
        @NotBlank(message = "手机号不能为空")
        private String phone;
        @NotBlank(message = "密码不能为空")
        private String password;

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class WechatLoginRequest {
        @NotBlank(message = "微信授权码不能为空")
        private String code;
        private String encryptedData;
        private String iv;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getEncryptedData() { return encryptedData; }
        public void setEncryptedData(String encryptedData) { this.encryptedData = encryptedData; }
        public String getIv() { return iv; }
        public void setIv(String iv) { this.iv = iv; }
    }
}
