package com.campuseval.notification;

import com.campuseval.model.entity.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 通知分发器 — 将通知写入 DB，后续可扩展微信模板消息推送
 *
 * TODO: 注入 NotificationMapper 写入数据库
 * TODO: 集成微信模板消息 API
 */
@Component
public class NotificationDispatcher {

    private static final Logger log = LoggerFactory.getLogger(NotificationDispatcher.class);

    /**
     * 分发通知
     * 1. 写入 notification 表（供前端轮询）
     * 2. （未来）发送微信模板消息
     */
    @Async
    public void dispatch(NotificationTemplate tpl) {
        // 1. 构建实体写入 DB
        Notification entity = new Notification();
        entity.setParentId(tpl.getParentId());
        entity.setStudentId(tpl.getStudentId());
        entity.setType(tpl.getType());
        entity.setTitle(tpl.getTitle());
        entity.setBrief(tpl.getBrief());
        entity.setDataJson(toJson(tpl.buildDataJson()));
        entity.setIsRead(0);
        entity.setCreatedAt(LocalDateTime.now());

        // TODO: notificationMapper.insert(entity);
        log.info("[Notification] 通知已写入: type={}, title={}, parentId={}",
                tpl.getType(), tpl.getTitle(), tpl.getParentId());

        // 2. 微信模板消息（后续实现）
        // sendWechatTemplate(tpl);
    }

    /**
     * 发送微信模板消息
     */
    private void sendWechatTemplate(NotificationTemplate tpl) {
        // TODO: 调用微信模板消息 API
        // 需要 parent 的 wechat_openid 和已订阅的模板ID
        log.debug("[Notification] 微信模板消息: parentId={}, title={}", tpl.getParentId(), tpl.getTitle());
    }

    private String toJson(Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
