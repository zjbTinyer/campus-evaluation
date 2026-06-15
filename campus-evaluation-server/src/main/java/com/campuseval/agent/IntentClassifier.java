package com.campuseval.agent;

import com.campuseval.agent.dto.AgentResponse.IntentItem;
import com.campuseval.common.constant.IntentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 意图分类器 — 双层策略
 *
 * Tier 1: 正则匹配快路径（< 5ms，覆盖 ~80% 查询）
 * Tier 2: LLM 兜底（正则置信度不足时触发）
 */
@Component
public class IntentClassifier {

    private static final Logger log = LoggerFactory.getLogger(IntentClassifier.class);
    private static final double FAST_PATH_THRESHOLD = 0.85;

    /**
     * 正则规则 — 按优先级排序
     */
    private static final List<IntentRule> RULES = Arrays.asList(
        // WRITE 操作（高优先级，避免被 QUERY 规则误匹配）
        new IntentRule(IntentType.ACTION_CHECKIN, 0.95,
            Pattern.compile("(?:帮|替|给).{0,6}(?:打卡|签到|确认.*完成)")),
        new IntentRule(IntentType.ACTION_SUBMIT_LEAVE, 0.95,
            Pattern.compile("(?:我要|想|需要|帮我|提交).{0,8}(?:请假|病假|事假)")),
        new IntentRule(IntentType.ACTION_REGISTER_ACTIVITY, 0.92,
            Pattern.compile("(?:我要|想|帮我|给).{0,6}(?:报名|参加).{0,6}(?:活动)")),

        // QUERY 意图
        new IntentRule(IntentType.QUERY_ARCHIVE, 0.90,
            Pattern.compile("(?:档案|上学期|上一年|上上|历史|回顾|总结|学期.*记录)")),
        new IntentRule(IntentType.QUERY_EVALUATION, 0.90,
            Pattern.compile("(?:评语|评价|表现|怎么样|如何|好吗){1}.*(?:数学|语文|英语|老师|最近|这周|上课)")),
        new IntentRule(IntentType.QUERY_EVALUATION, 0.80,
            Pattern.compile("(?:数学|语文|英语|物理|化学|生物|历史|地理|政治|体育|音乐|美术)(?:.*)(?:评语|评价|表现|怎么样|如何)")),
        new IntentRule(IntentType.QUERY_EVALUATION, 0.78,
            Pattern.compile("(?:老师|各科).{0,4}(?:评语|评价|说什么|怎么说)")),
        new IntentRule(IntentType.QUERY_HONOR, 0.92,
            Pattern.compile("(?:荣誉|奖状|证书|获奖|奖项|表扬|三好|优秀)")),
        new IntentRule(IntentType.QUERY_TASK, 0.90,
            Pattern.compile("(?:任务|打卡|作业|完成.*[了吗嘛呢]|做了.*[吗没])")),
        new IntentRule(IntentType.QUERY_TASK, 0.80,
            Pattern.compile("(?:还有|有哪些).{0,4}(?:任务|作业|事情).{0,4}(?:做|完成)")),
        new IntentRule(IntentType.QUERY_LEAVE, 0.92,
            Pattern.compile("(?:请假|假条|病假|事假|公假)(?:.*)(?:状态|审批|通过|驳回|记录)")),
        new IntentRule(IntentType.QUERY_LEAVE, 0.80,
            Pattern.compile("(?:请假|假条).{0,4}(?:怎么样|如何|结果)")),
        new IntentRule(IntentType.QUERY_ACTIVITY, 0.92,
            Pattern.compile("(?:活动|运动会|家长会|开放日|讲座|比赛|演出|通知)(?:.*)(?:什么时候|在哪|怎么|照片)")),
        new IntentRule(IntentType.QUERY_ACTIVITY, 0.85,
            Pattern.compile("(?:运动会|家长会|开放日|春游|秋游|比赛)")),

        // Dashboard / 综合
        new IntentRule(IntentType.QUERY_OVERVIEW, 0.82,
            Pattern.compile("(?:最近|这周|这个月).{0,3}(?:情况|表现|怎么样|如何|还好)")),
        new IntentRule(IntentType.QUERY_OVERVIEW, 0.75,
            Pattern.compile("(?:给我|帮我|来).{0,3}(?:讲讲|说说|看看|介绍一下).{0,4}(?:情况|表现|学校)")),
        new IntentRule(IntentType.QUERY_OVERVIEW, 0.70,
            Pattern.compile("(?:在学校|最近|这学期).{0,4}(?:表现|情况|状态|生活)"))
    );

    /**
     * 分类入口
     * @param query  用户自然语言输入
     * @return 按置信度降序排列的意图列表
     */
    public ClassificationResult classify(String query) {
        List<IntentItem> intents = new ArrayList<>();
        Set<String> seenTypes = new HashSet<>();

        // Tier 1: 正则匹配
        for (IntentRule rule : RULES) {
            Matcher m = rule.pattern.matcher(query);
            if (m.find()) {
                if (!seenTypes.contains(rule.intentType)) {
                    intents.add(new IntentItem(rule.intentType, rule.confidence, intentToTool(rule.intentType)));
                    seenTypes.add(rule.intentType);
                }
            }
        }

        // 判断是否需要 LLM 兜底
        boolean needLLM = intents.isEmpty() || intents.get(0).getConfidence() < FAST_PATH_THRESHOLD;

        ClassificationResult result = new ClassificationResult();
        result.intents = intents;
        result.needLLM = needLLM;
        result.matchedByRegex = !intents.isEmpty();

        log.debug("[IntentClassifier] query=\"{}\" → intents={}, needLLM={}", query, intents, needLLM);
        return result;
    }

    /**
     * 意图类型 → 默认 Tool 名称映射
     */
    public static String intentToTool(String intentType) {
        switch (intentType) {
            case IntentType.QUERY_EVALUATION:       return "query_evaluations";
            case IntentType.QUERY_HONOR:            return "query_honors";
            case IntentType.QUERY_TASK:             return "query_tasks";
            case IntentType.QUERY_LEAVE:            return "query_leaves";
            case IntentType.QUERY_ACTIVITY:         return "query_activities";
            case IntentType.QUERY_ARCHIVE:          return "query_archive";
            case IntentType.QUERY_OVERVIEW:         return "query_overview";
            case IntentType.ACTION_CHECKIN:         return "checkin_task";
            case IntentType.ACTION_SUBMIT_LEAVE:    return "submit_leave";
            case IntentType.ACTION_REGISTER_ACTIVITY: return "register_activity";
            default:                                return null;
        }
    }

    // -- Inner types --

    private static class IntentRule {
        final String intentType;
        final double confidence;
        final Pattern pattern;

        IntentRule(String intentType, double confidence, Pattern pattern) {
            this.intentType = intentType;
            this.confidence = confidence;
            this.pattern = pattern;
        }
    }

    public static class ClassificationResult {
        public List<IntentItem> intents;
        public boolean needLLM;
        public boolean matchedByRegex;
    }
}
