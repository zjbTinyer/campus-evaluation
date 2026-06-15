package com.campuseval.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 实体提取器 — 从自然语言中提取结构化实体
 *
 * 提取目标:
 * - student: 学生名称/别名
 * - subject: 科目
 * - time_range: 时间范围
 * - task_type: 任务类型
 * - leave_type: 请假类型
 * - honor_level: 荣誉级别
 * - activity_type: 活动类型
 */
@Component
public class EntityExtractor {

    private static final Logger log = LoggerFactory.getLogger(EntityExtractor.class);

    /** 时间表达 → 日期范围 */
    private static final Map<String, TimeRangeSupplier> TIME_PATTERNS = new LinkedHashMap<>();

    static {
        TIME_PATTERNS.put("今天", () -> new DateRange(today(), today()));
        TIME_PATTERNS.put("昨天", () -> new DateRange(today().minusDays(1), today().minusDays(1)));
        TIME_PATTERNS.put("前天", () -> new DateRange(today().minusDays(2), today().minusDays(2)));
        TIME_PATTERNS.put("这周|本周|最近一周", () -> {
            LocalDate mon = today().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            return new DateRange(mon, today());
        });
        TIME_PATTERNS.put("上周|上一周", () -> {
            LocalDate prevMon = today().minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            return new DateRange(prevMon, prevMon.plusDays(6));
        });
        TIME_PATTERNS.put("这个月|本月|最近一个月", () ->
            new DateRange(today().withDayOfMonth(1), today()));
        TIME_PATTERNS.put("上个月|上月", () -> {
            LocalDate first = today().minusMonths(1).withDayOfMonth(1);
            return new DateRange(first, first.plusMonths(1).minusDays(1));
        });
        TIME_PATTERNS.put("这学期|本学期", () ->
            new DateRange(LocalDate.of(2026, 2, 15), today())); // 硬编码当前学期
        TIME_PATTERNS.put("上学期|上个学期", () ->
            new DateRange(LocalDate.of(2025, 9, 1), LocalDate.of(2026, 1, 15)));
        TIME_PATTERNS.put("最近|近期", () ->
            new DateRange(today().minusDays(14), today()));
        TIME_PATTERNS.put("最近三天|近三天|这三天", () ->
            new DateRange(today().minusDays(2), today()));
        TIME_PATTERNS.put("最近一周|近一周", () ->
            new DateRange(today().minusDays(6), today()));
    }

    /**
     * 提取所有实体
     */
    public EntityResult extract(String query) {
        EntityResult result = new EntityResult();

        result.subject = extractSubject(query);
        result.timeRange = extractTimeRange(query);
        result.taskType = extractTaskType(query);
        result.leaveType = extractLeaveType(query);
        result.honorLevel = extractHonorLevel(query);
        result.activityType = extractActivityType(query);
        result.semester = extractSemester(query);
        result.keyword = extractKeyword(query);
        // student 在 AgentOrchestrator 中通过 ContextManager 解析

        log.debug("[EntityExtractor] query=\"{}\" → {}", query, result);
        return result;
    }

    /** 提取科目 */
    private String extractSubject(String query) {
        String[] subjects = {"数学", "语文", "英语", "物理", "化学", "生物",
                            "历史", "地理", "政治", "体育", "音乐", "美术"};
        for (String s : subjects) {
            if (query.contains(s)) return s;
        }
        return null;
    }

    /** 提取时间范围 */
    private DateRange extractTimeRange(String query) {
        for (Map.Entry<String, TimeRangeSupplier> e : TIME_PATTERNS.entrySet()) {
            if (Pattern.compile(e.getKey()).matcher(query).find()) {
                return e.getValue().get();
            }
        }
        return null;
    }

    /** 提取任务类型 */
    private String extractTaskType(String query) {
        String[] types = {"跳绳", "阅读", "作业", "家务", "练字", "口算", "日记", "古诗"};
        for (String t : types) {
            if (query.contains(t)) return t;
        }
        return null;
    }

    /** 提取请假类型 */
    private String extractLeaveType(String query) {
        if (query.contains("病假")) return "病假";
        if (query.contains("事假")) return "事假";
        if (query.contains("公假")) return "公假";
        return null;
    }

    /** 提取荣誉级别 */
    private String extractHonorLevel(String query) {
        if (query.contains("国家")) return "国家级";
        if (query.contains("省")) return "省级";
        if (query.contains("市")) return "市级";
        if (query.contains("区") || query.contains("县")) return "区级";
        if (query.contains("校")) return "校级";
        return null;
    }

    /** 提取活动类型 */
    private String extractActivityType(String query) {
        if (query.contains("运动会")) return "文体活动";
        if (query.contains("家长会")) return "家长会";
        if (query.contains("开放日")) return "开放日";
        if (query.contains("讲座")) return "讲座";
        if (query.contains("比赛") || query.contains("竞赛")) return "比赛";
        if (query.contains("实践") || query.contains("春游") || query.contains("秋游")) return "社会实践";
        return null;
    }

    /** 提取学期 */
    private String extractSemester(String query) {
        if (Pattern.compile("上学期|上个学期|上一年").matcher(query).find())
            return "2025-2026-1";
        if (Pattern.compile("这学期|本学期|这学年").matcher(query).find())
            return "2025-2026-2";
        // 匹配 "2025-2026-1" 格式
        Matcher m = Pattern.compile("(\\d{4}-\\d{4}-[12])").matcher(query);
        if (m.find()) return m.group(1);
        return null;
    }

    /** 提取关键词（评语/活动搜索用） */
    private String extractKeyword(String query) {
        // 除去时间、科目等结构化词后的剩余特征词
        String[] keywords = {"进步", "注意力", "作业", "课堂", "考试", "成绩", "不认真", "优秀", "努力", "退步"};
        for (String kw : keywords) {
            if (query.contains(kw)) return kw;
        }
        return null;
    }

    private static LocalDate today() {
        return LocalDate.now();
    }

    // -- Inner types --

    @FunctionalInterface
    private interface TimeRangeSupplier {
        DateRange get();
    }

    public static class DateRange {
        private String dateFrom;
        private String dateTo;

        public DateRange(LocalDate from, LocalDate to) {
            this.dateFrom = from.toString();
            this.dateTo = to.toString();
        }

        public String getDateFrom() { return dateFrom; }
        public String getDateTo() { return dateTo; }
    }

    /**
     * 实体提取结果
     */
    public static class EntityResult {
        public String subject;
        public DateRange timeRange;
        public String taskType;
        public String leaveType;
        public String honorLevel;
        public String activityType;
        public String semester;
        public String keyword;

        @Override
        public String toString() {
            return String.format("EntityResult{subject=%s, time=[%s,%s], task=%s, leave=%s, honor=%s, activity=%s, semester=%s}",
                    subject,
                    timeRange != null ? timeRange.dateFrom : null,
                    timeRange != null ? timeRange.dateTo : null,
                    taskType, leaveType, honorLevel, activityType, semester);
        }
    }
}
