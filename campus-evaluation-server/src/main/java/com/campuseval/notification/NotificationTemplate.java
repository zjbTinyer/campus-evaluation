package com.campuseval.notification;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 通知模板 — 不可变数据结构
 */
public class NotificationTemplate {

    private final String type;
    private final String title;
    private final String brief;
    private final Long parentId;
    private final Long studentId;
    private final String actionUrl;
    private final Map<String, Object> extra;

    private NotificationTemplate(Builder builder) {
        this.type = builder.type;
        this.title = builder.title;
        this.brief = builder.brief;
        this.parentId = builder.parentId;
        this.studentId = builder.studentId;
        this.actionUrl = builder.actionUrl;
        this.extra = builder.extra;
    }

    public static Builder builder(String type) {
        return new Builder(type);
    }

    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getBrief() { return brief; }
    public Long getParentId() { return parentId; }
    public Long getStudentId() { return studentId; }
    public String getActionUrl() { return actionUrl; }
    public Map<String, Object> getExtra() { return extra; }

    /**
     * 构建 data_json 字段
     */
    public Map<String, Object> buildDataJson() {
        Map<String, Object> data = new LinkedHashMap<>(extra);
        data.put("actionUrl", actionUrl);
        return data;
    }

    public static class Builder {
        private final String type;
        private String title;
        private String brief;
        private Long parentId;
        private Long studentId;
        private String actionUrl;
        private final Map<String, Object> extra = new LinkedHashMap<>();

        Builder(String type) { this.type = type; }

        public Builder title(String title) { this.title = title; return this; }
        public Builder brief(String brief) { this.brief = brief; return this; }
        public Builder parentId(Long parentId) { this.parentId = parentId; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder actionUrl(String actionUrl) { this.actionUrl = actionUrl; return this; }
        public Builder extra(String key, Object value) { this.extra.put(key, value); return this; }

        public NotificationTemplate build() {
            if (type == null) throw new IllegalArgumentException("type 不能为空");
            if (title == null) throw new IllegalArgumentException("title 不能为空");
            if (parentId == null) throw new IllegalArgumentException("parentId 不能为空");
            return new NotificationTemplate(this);
        }
    }
}
