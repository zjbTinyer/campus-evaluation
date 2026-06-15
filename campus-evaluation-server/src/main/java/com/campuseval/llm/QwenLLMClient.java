package com.campuseval.llm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * 通义千问 LLM 客户端
 *
 * API 文档: https://help.aliyun.com/zh/model-studio/
 */
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "qwen", matchIfMissing = true)
public class QwenLLMClient implements LLMClient {

    private static final Logger log = LoggerFactory.getLogger(QwenLLMClient.class);

    @Value("${llm.api-key}")
    private String apiKey;

    @Value("${llm.base-url.qwen}")
    private String baseUrl;

    @Value("${llm.model.default}")
    private String defaultModel;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chat(String systemPrompt, String userMessage, int maxTokens, double temperature) {
        try {
            String url = baseUrl + "/chat/completions";

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", defaultModel);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(msg("system", systemPrompt));
            messages.add(msg("user", userMessage));
            body.put("messages", messages);

            body.put("max_tokens", maxTokens);
            body.put("temperature", temperature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            log.error("[QwenLLM] 调用失败", e);
        }
        return null;
    }

    @Override
    public String getModelName() {
        return defaultModel;
    }

    private Map<String, String> msg(String role, String content) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("role", role);
        m.put("content", content);
        return m;
    }
}
