package com.campuseval.controller;

import com.campuseval.model.dto.UnifiedResponse;
import com.campuseval.security.CurrentUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Dashboard API — 综合概览、近期更新
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    /**
     * 综合概览 — 家长首页数据
     */
    @GetMapping("/overview")
    public UnifiedResponse<Map<String, Object>> overview(@CurrentUser Long parentId,
                                                          @RequestParam(required = false) String studentId) {
        log.debug("[Dashboard] overview: parentId={}, studentId={}", parentId, studentId);

        Map<String, Object> data = new HashMap<>();

        // TODO: 调用各 Service 聚合数据
        // - 最新3条评语
        // - 待完成任务数
        // - 最新荣誉
        // - 待审批请假数
        // - 最近活动

        data.put("recentEvaluations", Collections.emptyList());
        data.put("pendingTasks", 0);
        data.put("recentHonors", Collections.emptyList());
        data.put("pendingLeaves", 0);
        data.put("upcomingActivities", Collections.emptyList());

        return UnifiedResponse.ok(data);
    }

    /**
     * 近期更新 — 所有模块的最新动态聚合
     */
    @GetMapping("/recent-updates")
    public UnifiedResponse<List<Map<String, Object>>> recentUpdates(@CurrentUser Long parentId) {
        // TODO: 聚合各模块最近7天的更新，按时间倒序
        return UnifiedResponse.ok(Collections.emptyList());
    }

    /**
     * 家长关联的学生列表
     */
    @GetMapping("/students")
    public UnifiedResponse<List<Map<String, Object>>> linkedStudents(@CurrentUser Long parentId) {
        // TODO: SELECT s.* FROM parent_student ps JOIN student s ON ps.student_id=s.id WHERE ps.parent_id=?
        List<Map<String, Object>> students = new ArrayList<>();

        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "1");
        s1.put("name", "小明");
        s1.put("className", "三年级二班");
        s1.put("grade", 3);
        students.add(s1);

        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "2");
        s2.put("name", "小红");
        s2.put("className", "一年级一班");
        s2.put("grade", 1);
        students.add(s2);

        return UnifiedResponse.ok(students);
    }
}
