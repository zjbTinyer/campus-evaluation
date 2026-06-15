package com.campuseval.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 历史档案
 */
@TableName("archive_record")
public class ArchiveRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long studentId;
    private Long semesterId;
    private String archiveType;      // 期末档案/学年档案/毕业档案
    private String summary;
    private BigDecimal attendanceRate;
    private BigDecimal totalScore;
    private Integer rank;
    private String evaluationData;   // JSON 快照
    private Integer isPublished;
    private LocalDateTime publishedAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }
    public String getArchiveType() { return archiveType; }
    public void setArchiveType(String archiveType) { this.archiveType = archiveType; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public BigDecimal getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(BigDecimal attendanceRate) { this.attendanceRate = attendanceRate; }
    public BigDecimal getTotalScore() { return totalScore; }
    public void setTotalScore(BigDecimal totalScore) { this.totalScore = totalScore; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public String getEvaluationData() { return evaluationData; }
    public void setEvaluationData(String evaluationData) { this.evaluationData = evaluationData; }
    public Integer getIsPublished() { return isPublished; }
    public void setIsPublished(Integer isPublished) { this.isPublished = isPublished; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
