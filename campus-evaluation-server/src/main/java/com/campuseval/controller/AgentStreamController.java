package com.campuseval.controller;

import com.campuseval.agent.AgentOrchestrator;
import com.campuseval.agent.dto.AgentRequest;
import com.campuseval.agent.dto.AgentResponse;
import com.campuseval.security.CurrentUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

/**
 * Agent SSE 流式响应 — 提供更好的用户体验
 *
 * SSE 事件类型:
 * - "intent"      意图识别完成
 * - "segment"     单个 Tool 结果就绪
 * - "summary"     综合摘要
 * - "suggestion"  追问建议
 * - "done"        全部完成
 * - "error"       错误
 */
@RestController
@RequestMapping("/api/v1/agent")
public class AgentStreamController {

    private static final Logger log = LoggerFactory.getLogger(AgentStreamController.class);
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final long SSE_TIMEOUT = 30000L; // 30秒超时

    private final AgentOrchestrator orchestrator;

    public AgentStreamController(AgentOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    /**
     * SSE 流式查询
     *
     * 前端使用 EventSource:
     *   const es = new EventSource('/api/v1/agent/stream');
     *   es.addEventListener('segment', (e) => { ... });
     */
    @PostMapping("/stream")
    public SseEmitter stream(@RequestBody AgentRequest request, @CurrentUser Long parentId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        // 异步处理，逐步推送结果
        CompletableFuture.runAsync(() -> {
            try {
                // 1. 发送意图识别结果
                AgentResponse response = orchestrator.process(request, parentId);
                sendEvent(emitter, "intent", response.getIntents());

                // 2. 逐个发送 segment
                if (response.getSegments() != null) {
                    for (AgentResponse.Segment seg : response.getSegments()) {
                        sendEvent(emitter, "segment", seg);
                        // 模拟逐段推送的延迟（实际场景中 Tool 结果逐个到达）
                        Thread.sleep(200);
                    }
                }

                // 3. 发送综合摘要
                sendEvent(emitter, "summary", response.getSummary());

                // 4. 发送追问建议
                sendEvent(emitter, "suggestion", response.getSuggestions());

                // 5. 完成
                sendEvent(emitter, "done", Map.of(
                        "sessionId", response.getSessionId(),
                        "elapsedMs", response.getElapsedMs()
                ));

                emitter.complete();

            } catch (Exception e) {
                log.error("[AgentStream] SSE 推送异常", e);
                try {
                    sendEvent(emitter, "error", Map.of("message", e.getMessage()));
                } catch (IOException ignored) {}
                emitter.completeWithError(e);
            }
        });

        // 注册超时和完成回调
        emitter.onTimeout(emitter::complete);
        emitter.onError(Throwable::printStackTrace);

        return emitter;
    }

    private void sendEvent(SseEmitter emitter, String eventName, Object data) throws IOException {
        emitter.send(SseEmitter.event()
                .name(eventName)
                .data(mapper.writeValueAsString(data)));
    }
}
