package com.campuseval.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 教师评语
 */
@TableName("teacher_evaluation")
public class TeacherEvaluation {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long studentId;
    private Long teacherId;
    private String subject;
    private String evaluationType;   // 日常评语/期中评语/期末评语/课堂表现
    private String content;
    private Integer score;           // 1-5分
    private Long semesterId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getEvaluationType() { return evaluationType; }
    public void setEvaluationType(String evaluationType) { this.evaluationType = evaluationType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
