package com.campuseval.security;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Token 工具 — 生成、解析、校验
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    /**
     * 生成 Access Token
     * @param parentId   家长ID
     * @param phone      手机号（登录标识）
     */
    public String generateToken(Long parentId, String phone) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("parentId", parentId);
        claims.put("phone", phone);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(parentId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    /**
     * 从 Token 中解析 parentId
     */
    public Long getParentId(String token) {
        Claims claims = parseToken(token);
        return claims != null ? Long.valueOf(claims.getSubject()) : null;
    }

    /**
     * 校验 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            log.debug("JWT 校验失败: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
    }
}
