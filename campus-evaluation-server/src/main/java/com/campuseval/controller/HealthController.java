package com.campuseval.controller;

import com.campuseval.model.dto.UnifiedResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 健康检查 & 系统信息
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public UnifiedResponse<Map<String, Object>> health() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("service", "campus-evaluation-server");
        info.put("version", "1.0.0");
        info.put("timestamp", LocalDateTime.now().toString());
        return UnifiedResponse.ok(info);
    }
}
