package com.campuseval.agent;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Agent 常量 — 意图类型 & Tool 名称
 */
public class AgentConstants {

    private AgentConstants() {}

    // ========== 10 个 Tool 的 JSON Schema 参数定义 ==========

    public static Map<String, Object> paramsQueryEvaluations() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj(
            "type", "array",
            "items", obj("type", "string"),
            "description", "目标学生ID列表"
        ));
        props.put("subjects", obj(
            "type", "array",
            "items", obj("type", "string", "enum", Arrays.asList(
                "语文","数学","英语","物理","化学","生物","历史","地理","政治","体育","音乐","美术","综合"
            )),
            "description", "科目筛选"
        ));
        props.put("date_from", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$", "description", "起始日期 YYYY-MM-DD"));
        props.put("date_to", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$", "description", "结束日期 YYYY-MM-DD"));
        props.put("semester", obj("type", "string", "pattern", "^\\d{4}-\\d{4}-[12]$", "description", "学期，如2025-2026-1"));
        props.put("keyword", obj("type", "string", "description", "评语关键词搜索"));
        props.put("evaluation_type", obj("type", "string", "enum",
                Arrays.asList("日常评语","期中评语","期末评语","课堂表现"), "description", "评语类型"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 50, "default", 10));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsQueryHonors() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj("type", "array", "items", obj("type", "string")));
        props.put("honor_type", obj("type", "string", "enum",
                Arrays.asList("校级","区级","市级","省级","国家级"), "description", "荣誉级别"));
        props.put("category", obj("type", "string", "enum",
                Arrays.asList("学习","体育","艺术","品德","竞赛","其他"), "description", "荣誉类别"));
        props.put("date_from", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("date_to", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("semester", obj("type", "string", "pattern", "^\\d{4}-\\d{4}-[12]$"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 50, "default", 20));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsQueryTasks() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj("type", "array", "items", obj("type", "string")));
        props.put("task_status", obj("type", "string", "enum",
                Arrays.asList("待完成","已完成","已逾期","全部"), "description", "任务状态"));
        props.put("date_from", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("date_to", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 50, "default", 20));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsCheckinTask() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("task_id", obj("type", "string", "description", "任务ID"));
        props.put("student_id", obj("type", "string", "description", "学生ID"));
        props.put("remark", obj("type", "string", "maxLength", 200, "description", "备注"));
        props.put("evidence_urls", obj("type", "array", "items", obj("type", "string", "format", "uri")));
        return obj("type", "object", "properties", props, "required", Arrays.asList("task_id", "student_id"));
    }

    public static Map<String, Object> paramsQueryLeaves() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj("type", "array", "items", obj("type", "string")));
        props.put("status", obj("type", "string", "enum",
                Arrays.asList("待审批","已批准","已驳回","已撤销","全部"), "description", "审批状态"));
        props.put("date_from", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("date_to", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 50, "default", 10));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsSubmitLeave() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_id", obj("type", "string", "description", "学生ID"));
        props.put("leave_type", obj("type", "string", "enum",
                Arrays.asList("病假","事假","公假"), "description", "请假类型"));
        props.put("start_date", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$", "description", "开始日期"));
        props.put("end_date", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$", "description", "结束日期"));
        props.put("reason", obj("type", "string", "maxLength", 500, "description", "请假原因"));
        props.put("contact_phone", obj("type", "string", "pattern", "^1[3-9]\\d{9}$", "description", "联系电话"));
        props.put("attachment_urls", obj("type", "array", "items", obj("type", "string", "format", "uri")));
        return obj("type", "object", "properties", props,
                "required", Arrays.asList("student_id", "leave_type", "start_date", "end_date", "reason", "contact_phone"));
    }

    public static Map<String, Object> paramsQueryActivities() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("status", obj("type", "string", "enum",
                Arrays.asList("报名中","进行中","已结束","全部"), "description", "活动状态"));
        props.put("activity_type", obj("type", "string", "enum",
                Arrays.asList("文体活动","家长会","开放日","讲座","比赛","社会实践","其他"), "description", "活动类型"));
        props.put("date_from", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("date_to", obj("type", "string", "pattern", "^\\d{4}-\\d{2}-\\d{2}$"));
        props.put("keyword", obj("type", "string", "description", "关键词搜索"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 50, "default", 10));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsRegisterActivity() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("activity_id", obj("type", "string", "description", "活动ID"));
        props.put("student_id", obj("type", "string", "description", "报名学生ID"));
        props.put("remark", obj("type", "string", "maxLength", 200, "description", "备注"));
        return obj("type", "object", "properties", props, "required", Arrays.asList("activity_id", "student_id"));
    }

    public static Map<String, Object> paramsQueryArchive() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj("type", "array", "items", obj("type", "string")));
        props.put("semester", obj("type", "string", "pattern", "^\\d{4}-\\d{4}-[12]$", "description", "学期"));
        props.put("archive_type", obj("type", "string", "enum",
                Arrays.asList("期末档案","学年档案","毕业档案"), "description", "档案类型"));
        props.put("page", obj("type", "integer", "minimum", 1, "default", 1));
        props.put("page_size", obj("type", "integer", "minimum", 1, "maximum", 10, "default", 5));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    public static Map<String, Object> paramsQueryOverview() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("student_ids", obj("type", "array", "items", obj("type", "string")));
        props.put("days", obj("type", "integer", "minimum", 1, "maximum", 90, "default", 14, "description", "回顾天数"));
        return obj("type", "object", "properties", props, "required", Collections.emptyList());
    }

    // ========== 10 个 Tool 定义 ==========

    public static final List<ToolDef> ALL_TOOLS = Arrays.asList(
        new ToolDef("query_evaluations", "查询学生收到的教师评语/评价记录，支持按科目、时间范围、学期、关键词筛选",
                "READ", paramsQueryEvaluations()),
        new ToolDef("query_honors", "查询学生获得的荣誉奖项记录，支持按级别、类别、时间范围筛选",
                "READ", paramsQueryHonors()),
        new ToolDef("query_tasks", "查询学生的任务列表及打卡完成情况，支持按状态和时间范围筛选",
                "READ", paramsQueryTasks()),
        new ToolDef("checkin_task", "家长帮助学生完成指定任务的打卡（确认任务已完成），需提供task_id和student_id",
                "WRITE", paramsCheckinTask()),
        new ToolDef("query_leaves", "查询请假申请记录及审批状态，支持按状态和时间范围筛选",
                "READ", paramsQueryLeaves()),
        new ToolDef("submit_leave", "提交学生的请假申请，需提供学生ID、请假类型、日期、原因、联系电话",
                "WRITE", paramsSubmitLeave()),
        new ToolDef("query_activities", "查询学校发布的各类活动通知，支持按状态、类型、时间范围、关键词筛选",
                "READ", paramsQueryActivities()),
        new ToolDef("register_activity", "家长为学生报名参加学校活动，需提供活动ID和学生ID",
                "WRITE", paramsRegisterActivity()),
        new ToolDef("query_archive", "查询学生历史学期/学年的档案记录，包括综合评价、成绩回顾等",
                "READ", paramsQueryArchive()),
        new ToolDef("query_overview", "获取学生近期综合概览，包含最新评语、待办任务、审批状态等聚合信息",
                "READ", paramsQueryOverview())
    );

    // -- helper --

    @SafeVarargs
    private static Map<String, Object> obj(Map.Entry<String, Object>... entries) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (Map.Entry<String, Object> e : entries) {
            m.put(e.getKey(), e.getValue());
        }
        return m;
    }

    // build Map entries fluently
    private static Map.Entry<String, Object> e(String k, Object v) {
        return new AbstractMap.SimpleEntry<>(k, v);
    }

    // -- simpler obj builder --
    @SuppressWarnings("unchecked")
    private static Map<String, Object> obj(Object... kvs) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kvs.length; i += 2) {
            m.put((String) kvs[i], kvs[i + 1]);
        }
        return m;
    }

    public static class ToolDef {
        public final String name;
        public final String description;
        public final String actionType;
        public final Map<String, Object> parameters;

        public ToolDef(String name, String description, String actionType, Map<String, Object> parameters) {
            this.name = name;
            this.description = description;
            this.actionType = actionType;
            this.parameters = parameters;
        }
    }
}
