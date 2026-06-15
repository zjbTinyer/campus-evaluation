package com.campuseval.search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.*;
import java.time.LocalDate;

/**
 * 文档构建器 — 将结构化数据转为可供搜索的文本模板
 *
 * 数据源 → 模板化文本 → search_document 表 + ES 索引
 */
@Component
public class DocumentBuilder {

    private static final Logger log = LoggerFactory.getLogger(DocumentBuilder.class);

    /**
     * 评语 → 搜索文档
     */
    public SearchDoc buildEvaluationDoc(Long studentId, Long evaluationId, String studentName,
                                         String teacherName, String subject, String evaluationType,
                                         String content, Integer score, String semesterName, LocalDate date) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生").append(studentName).append("。");
        sb.append("科目：").append(subject).append("。");
        sb.append("类型：").append(evaluationType).append("。");
        sb.append("教师：").append(teacherName).append("。");
        sb.append("学期：").append(semesterName).append("。");
        if (score != null) sb.append("评分：").append(score).append("/5分。");
        sb.append("评语内容：").append(content).append("。");
        sb.append("日期：").append(date != null ? date.toString() : "").append("。");

        return new SearchDoc(studentId, "evaluation", evaluationId,
                studentName + "-" + subject + "-" + evaluationType, sb.toString());
    }

    /**
     * 荣誉 → 搜索文档
     */
    public SearchDoc buildHonorDoc(Long studentId, Long honorId, String studentName,
                                    String honorName, String honorLevel, String category,
                                    LocalDate grantDate, String grantOrg, String description) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生").append(studentName).append("获得").append(honorName).append("（").append(honorLevel).append("）。");
        sb.append("类别：").append(category).append("。");
        if (grantOrg != null) sb.append("颁发机构：").append(grantOrg).append("。");
        sb.append("颁发日期：").append(grantDate != null ? grantDate.toString() : "").append("。");
        if (description != null) sb.append("描述：").append(description).append("。");

        return new SearchDoc(studentId, "honor", honorId,
                studentName + "-" + honorName, sb.toString());
    }

    /**
     * 任务 → 搜索文档
     */
    public SearchDoc buildTaskDoc(Long studentId, Long taskId, String studentName,
                                   String title, String taskType, String description,
                                   LocalDate dueDate, String status, int checkinCount, int totalCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生").append(studentName).append("的任务：").append(title).append("。");
        sb.append("类型：").append(taskType).append("。");
        if (description != null) sb.append("要求：").append(description).append("。");
        sb.append("截止日期：").append(dueDate != null ? dueDate.toString() : "").append("。");
        sb.append("状态：").append(status).append("。");
        sb.append("打卡进度：").append(checkinCount).append("/").append(totalCount).append("。");

        return new SearchDoc(studentId, "task", taskId,
                studentName + "-" + title, sb.toString());
    }

    /**
     * 请假 → 搜索文档
     */
    public SearchDoc buildLeaveDoc(Long studentId, Long leaveId, String studentName,
                                    String leaveType, LocalDate startDate, LocalDate endDate,
                                    String reason, String status) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生").append(studentName).append("的请假申请。");
        sb.append("类型：").append(leaveType).append("。");
        sb.append("日期：").append(startDate).append("至").append(endDate).append("。");
        sb.append("原因：").append(reason).append("。");
        sb.append("状态：").append(status).append("。");

        return new SearchDoc(studentId, "leave", leaveId,
                studentName + "-" + leaveType + "-" + startDate, sb.toString());
    }

    /**
     * 活动 → 搜索文档
     */
    public SearchDoc buildActivityDoc(Long activityId, String title, String activityType,
                                       String description, String location,
                                       String startTime, String endTime, String status) {
        // 活动是全校级别的，studentId 设为 0
        StringBuilder sb = new StringBuilder();
        sb.append("活动：").append(title).append("。");
        sb.append("类型：").append(activityType).append("。");
        if (location != null) sb.append("地点：").append(location).append("。");
        sb.append("时间：").append(startTime).append("至").append(endTime).append("。");
        if (description != null) sb.append("详情：").append(description).append("。");
        sb.append("状态：").append(status).append("。");

        return new SearchDoc(0L, "activity", activityId,
                title + "-" + activityType, sb.toString());
    }

    /**
     * 档案 → 搜索文档
     */
    public SearchDoc buildArchiveDoc(Long studentId, Long archiveId, String studentName,
                                      String archiveType, String semesterName, String summary) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生").append(studentName).append("的").append(archiveType).append("。");
        sb.append("学期：").append(semesterName).append("。");
        if (summary != null) sb.append("综合评价：").append(summary).append("。");

        return new SearchDoc(studentId, "archive", archiveId,
                studentName + "-" + semesterName + "-" + archiveType, sb.toString());
    }

    /**
     * 搜索文档数据结构
     */
    public static class SearchDoc {
        public final Long studentId;
        public final String docType;
        public final Long sourceId;
        public final String title;
        public final String content;

        public SearchDoc(Long studentId, String docType, Long sourceId, String title, String content) {
            this.studentId = studentId;
            this.docType = docType;
            this.sourceId = sourceId;
            this.title = title;
            this.content = content;
        }
    }
}
