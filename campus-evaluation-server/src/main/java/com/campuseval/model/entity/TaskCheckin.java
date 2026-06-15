package com.campuseval.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 任务打卡记录
 */
@TableName("task_checkin")
public class TaskCheckin {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long taskId;
    private Long studentId;
    private String checkinBy;        // 家长/学生/老师
    private LocalDateTime checkinTime;
    private String remark;
    private String evidenceUrls;     // JSON 数组字符串

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getCheckinBy() { return checkinBy; }
    public void setCheckinBy(String checkinBy) { this.checkinBy = checkinBy; }
    public LocalDateTime getCheckinTime() { return checkinTime; }
    public void setCheckinTime(LocalDateTime checkinTime) { this.checkinTime = checkinTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public String getEvidenceUrls() { return evidenceUrls; }
    public void setEvidenceUrls(String evidenceUrls) { this.evidenceUrls = evidenceUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
