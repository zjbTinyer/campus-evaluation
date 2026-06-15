package com.campuseval.notification;

import com.campuseval.common.constant.NotificationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 通知生产者 — 各业务模块通过此组件异步产生通知
 *
 * 使用方式:
 *   notificationProducer.produce(parentId, studentId, NotificationType.NEW_EVALUATION, data);
 */
@Component
public class NotificationProducer {

    private static final Logger log = LoggerFactory.getLogger(NotificationProducer.class);

    private final NotificationDispatcher dispatcher;

    public NotificationProducer(NotificationDispatcher dispatcher) {
        this.dispatcher = dispatcher;
    }

    /**
     * 教师发布新评语 → 通知家长
     */
    @Async
    public void onNewEvaluation(Long parentId, Long studentId, String teacherName,
                                 String subject, Long evaluationId) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.NEW_EVALUATION)
                .title(teacherName + "老师发布了" + subject + "评语")
                .brief("点击查看最新评价内容")
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/evaluations?highlight=" + evaluationId)
                .extra("evaluationId", evaluationId)
                .extra("teacherName", teacherName)
                .extra("subject", subject)
                .build();

        dispatcher.dispatch(tpl);
        log.info("[Notification] 新评语通知: parentId={}, studentId={}, evaluationId={}",
                parentId, studentId, evaluationId);
    }

    /**
     * 请假审批通过 → 通知家长
     */
    @Async
    public void onLeaveApproved(Long parentId, Long studentId, Long leaveId,
                                 String leaveType, String startDate, String endDate) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.LEAVE_APPROVED)
                .title("请假申请已批准")
                .brief(startDate + "至" + endDate + "的" + leaveType + "已审批通过")
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/leaves/" + leaveId)
                .extra("leaveId", leaveId)
                .build();

        dispatcher.dispatch(tpl);
    }

    /**
     * 请假被驳回 → 通知家长
     */
    @Async
    public void onLeaveRejected(Long parentId, Long studentId, Long leaveId,
                                 String reason) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.LEAVE_REJECTED)
                .title("请假申请被驳回")
                .brief("驳回原因：" + (reason != null ? reason : "请联系班主任"))
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/leaves/" + leaveId)
                .extra("leaveId", leaveId)
                .build();

        dispatcher.dispatch(tpl);
    }

    /**
     * 任务即将截止 → 提醒家长
     */
    @Async
    public void onTaskReminder(Long parentId, Long studentId, Long taskId,
                                String taskTitle, String dueDate) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.TASK_REMINDER)
                .title("任务即将截止提醒")
                .brief("「" + taskTitle + "」截止日期：" + dueDate + "，尚未完成")
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/tasks/" + taskId)
                .extra("taskId", taskId)
                .extra("dueDate", dueDate)
                .build();

        dispatcher.dispatch(tpl);
    }

    /**
     * 新活动发布
     */
    @Async
    public void onNewActivity(Long parentId, Long activityId, String title,
                               String activityType, String deadline) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.ACTIVITY_NEW)
                .title("新活动：" + title)
                .brief(activityType + (deadline != null ? "，报名截止：" + deadline : ""))
                .parentId(parentId)
                .studentId(null) // 全局通知
                .actionUrl("/activities/" + activityId)
                .extra("activityId", activityId)
                .build();

        dispatcher.dispatch(tpl);
    }

    /**
     * 活动即将开始 → 提醒已报名家长
     */
    @Async
    public void onActivityReminder(Long parentId, Long studentId, Long activityId,
                                    String title, String startTime, String location) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.ACTIVITY_REMINDER)
                .title("活动提醒：" + title)
                .brief("活动将于" + startTime + "在" + location + "开始")
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/activities/" + activityId)
                .extra("activityId", activityId)
                .build();

        dispatcher.dispatch(tpl);
    }

    /**
     * 学期档案发布
     */
    @Async
    public void onArchivePublished(Long parentId, Long studentId, Long archiveId,
                                    String semesterName) {
        NotificationTemplate tpl = NotificationTemplate.builder(NotificationType.ARCHIVE_PUBLISHED)
                .title(semesterName + "档案已发布")
                .brief("点击查看学期综合评价")
                .parentId(parentId)
                .studentId(studentId)
                .actionUrl("/archives/" + archiveId)
                .extra("archiveId", archiveId)
                .build();

        dispatcher.dispatch(tpl);
    }
}
