package com.campuseval.controller;

import com.campuseval.model.dto.UnifiedResponse;
import com.campuseval.security.CurrentUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 通知 API — 列表、未读计数、已读标记
 */
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    /**
     * 获取通知列表（未读优先）
     */
    @GetMapping
    public UnifiedResponse<Map<String, Object>> list(@CurrentUser Long parentId,
                                                      @RequestParam(defaultValue = "1") Integer page,
                                                      @RequestParam(defaultValue = "20") Integer pageSize) {
        log.debug("[Notification] 查询列表: parentId={}, page={}", parentId, page);

        // TODO: 调用 NotificationService 查数据库
        Map<String, Object> data = new HashMap<>();
        data.put("records", Collections.emptyList());
        data.put("total", 0);
        data.put("page", page);
        data.put("pageSize", pageSize);
        data.put("totalPages", 0);

        return UnifiedResponse.ok(data);
    }

    /**
     * 获取未读计数 — 前端轮询用（轻量接口）
     */
    @GetMapping("/unread-count")
    public UnifiedResponse<Map<String, Object>> unreadCount(@CurrentUser Long parentId) {
        // TODO: SELECT COUNT(*) FROM notification WHERE parent_id=? AND is_read=0
        int count = 0;

        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        data.put("hasNew", count > 0);

        return UnifiedResponse.ok(data);
    }

    /**
     * 标记单条已读
     */
    @PutMapping("/{id}/read")
    public UnifiedResponse<?> markRead(@PathVariable Long id, @CurrentUser Long parentId) {
        log.debug("[Notification] 标记已读: id={}, parentId={}", id, parentId);
        // TODO: UPDATE notification SET is_read=1, read_at=NOW() WHERE id=? AND parent_id=?
        return UnifiedResponse.ok();
    }

    /**
     * 标记全部已读
     */
    @PutMapping("/read-all")
    public UnifiedResponse<?> markAllRead(@CurrentUser Long parentId) {
        log.debug("[Notification] 全部已读: parentId={}", parentId);
        // TODO: UPDATE notification SET is_read=1, read_at=NOW() WHERE parent_id=? AND is_read=0
        return UnifiedResponse.ok();
    }
}
