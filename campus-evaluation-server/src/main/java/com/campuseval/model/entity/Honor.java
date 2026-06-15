package com.campuseval.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 荣誉奖项
 */
@TableName("honor")
public class Honor {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long studentId;
    private String name;
    private String honorLevel;       // 校级/区级/市级/省级/国家级
    private String category;         // 学习/体育/艺术/品德/竞赛/其他
    private LocalDate grantDate;
    private String grantOrg;
    private String certificateUrl;
    private String description;
    private Long semesterId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHonorLevel() { return honorLevel; }
    public void setHonorLevel(String honorLevel) { this.honorLevel = honorLevel; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate getGrantDate() { return grantDate; }
    public void setGrantDate(LocalDate grantDate) { this.grantDate = grantDate; }
    public String getGrantOrg() { return grantOrg; }
    public void setGrantOrg(String grantOrg) { this.grantOrg = grantOrg; }
    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
