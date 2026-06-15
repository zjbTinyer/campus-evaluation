-- ============================================================
-- 校园评价系统 — 数据库初始化脚本
-- Version: 1.0
-- ============================================================

-- 学期表
CREATE TABLE IF NOT EXISTS `semester` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code`         VARCHAR(20)  NOT NULL UNIQUE COMMENT '学期代码: 2025-2026-1',
    `name`         VARCHAR(50)  NOT NULL COMMENT '学期名称',
    `start_date`   DATE         NOT NULL COMMENT '学期开始日期',
    `end_date`     DATE         NOT NULL COMMENT '学期结束日期',
    `is_current`   TINYINT      DEFAULT 0 COMMENT '是否当前学期',
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学期信息';

-- 班级表
CREATE TABLE IF NOT EXISTS `class` (
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`             VARCHAR(50)  NOT NULL COMMENT '班级名称，如三年级二班',
    `grade`            TINYINT      NOT NULL COMMENT '年级: 1-12',
    `head_teacher_id`  BIGINT UNSIGNED DEFAULT NULL COMMENT '班主任ID',
    `created_at`       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_grade` (`grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='班级信息';

-- 学生表
CREATE TABLE IF NOT EXISTS `student` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid`         VARCHAR(32)  NOT NULL UNIQUE COMMENT '全局唯一ID',
    `name`         VARCHAR(50)  NOT NULL COMMENT '学生姓名',
    `gender`       TINYINT      DEFAULT 0 COMMENT '0未知 1男 2女',
    `student_no`   VARCHAR(32)  NOT NULL UNIQUE COMMENT '学号',
    `class_id`     BIGINT UNSIGNED NOT NULL COMMENT '班级ID',
    `grade`        TINYINT      NOT NULL COMMENT '年级',
    `avatar_url`   VARCHAR(255) DEFAULT NULL COMMENT '头像',
    `enroll_date`  DATE         NOT NULL COMMENT '入学日期',
    `status`       TINYINT      DEFAULT 1 COMMENT '1在读 0离校 -1转学',
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_class` (`class_id`),
    INDEX `idx_grade` (`grade`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生信息';

-- 家长表
CREATE TABLE IF NOT EXISTS `parent` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid`           VARCHAR(32)  NOT NULL UNIQUE,
    `name`           VARCHAR(50)  NOT NULL COMMENT '家长姓名',
    `phone`          VARCHAR(20)  NOT NULL UNIQUE COMMENT '手机号（登录账号）',
    `password_hash`  VARCHAR(128) NOT NULL COMMENT 'bcrypt加密',
    `wechat_openid`  VARCHAR(64)  DEFAULT NULL COMMENT '微信OpenID',
    `avatar_url`     VARCHAR(255) DEFAULT NULL,
    `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_phone` (`phone`),
    INDEX `idx_wechat` (`wechat_openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家长信息';

-- 家长-学生关联表
CREATE TABLE IF NOT EXISTS `parent_student` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id`    BIGINT UNSIGNED NOT NULL,
    `student_id`   BIGINT UNSIGNED NOT NULL,
    `relation`     VARCHAR(20) NOT NULL COMMENT '父子/母子/监护人',
    `is_default`   TINYINT DEFAULT 0 COMMENT '是否默认查看学生',
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_parent_student` (`parent_id`, `student_id`),
    INDEX `idx_student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家长-学生关联';

-- 教师表
CREATE TABLE IF NOT EXISTS `teacher` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid`         VARCHAR(32)  NOT NULL UNIQUE,
    `name`         VARCHAR(50)  NOT NULL,
    `phone`        VARCHAR(20)  NOT NULL UNIQUE,
    `subject`      VARCHAR(20)  DEFAULT NULL COMMENT '主教科目',
    `title`        VARCHAR(50)  DEFAULT NULL COMMENT '职称',
    `avatar_url`   VARCHAR(255) DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教师信息';

-- 教师评语表
CREATE TABLE IF NOT EXISTS `teacher_evaluation` (
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`       BIGINT UNSIGNED NOT NULL,
    `teacher_id`       BIGINT UNSIGNED NOT NULL,
    `subject`          VARCHAR(20)  NOT NULL COMMENT '科目',
    `evaluation_type`  VARCHAR(20)  NOT NULL COMMENT '日常评语/期中评语/期末评语/课堂表现',
    `content`          TEXT         NOT NULL COMMENT '评语内容',
    `score`            TINYINT      DEFAULT NULL COMMENT '评分1-5',
    `semester_id`      BIGINT UNSIGNED NOT NULL,
    `created_at`       DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_student` (`student_id`),
    INDEX `idx_teacher` (`teacher_id`),
    INDEX `idx_semester` (`semester_id`),
    INDEX `idx_subject` (`subject`),
    INDEX `idx_created` (`created_at` DESC),
    FULLTEXT INDEX `ft_content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教师评语';

-- 荣誉表
CREATE TABLE IF NOT EXISTS `honor` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`      BIGINT UNSIGNED NOT NULL,
    `name`            VARCHAR(100) NOT NULL COMMENT '荣誉名称',
    `honor_level`     VARCHAR(20)  NOT NULL COMMENT '校级/区级/市级/省级/国家级',
    `category`        VARCHAR(20)  NOT NULL COMMENT '学习/体育/艺术/品德/竞赛/其他',
    `grant_date`      DATE         NOT NULL COMMENT '获得日期',
    `grant_org`       VARCHAR(100) DEFAULT NULL COMMENT '颁发机构',
    `certificate_url` VARCHAR(255) DEFAULT NULL COMMENT '证书图片URL',
    `description`     TEXT         DEFAULT NULL COMMENT '描述/备注',
    `semester_id`     BIGINT UNSIGNED NOT NULL,
    `created_at`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_student` (`student_id`),
    INDEX `idx_level` (`honor_level`),
    INDEX `idx_category` (`category`),
    INDEX `idx_date` (`grant_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='荣誉奖项';

-- 任务表
CREATE TABLE IF NOT EXISTS `task` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`      BIGINT UNSIGNED NOT NULL,
    `title`           VARCHAR(100) NOT NULL COMMENT '任务标题',
    `description`     TEXT         DEFAULT NULL COMMENT '任务描述',
    `task_type`       VARCHAR(20)  NOT NULL COMMENT '作业/阅读/运动/家务/其他',
    `assigned_date`   DATE         NOT NULL COMMENT '布置日期',
    `due_date`        DATE         NOT NULL COMMENT '截止日期',
    `repeat_type`     VARCHAR(20)  DEFAULT '一次性' COMMENT '一次性/每日/每周',
    `status`          VARCHAR(20)  DEFAULT '待完成' COMMENT '待完成/已完成/已逾期',
    `checkin_count`   INT          DEFAULT 0 COMMENT '已打卡次数',
    `total_count`     INT          DEFAULT 1 COMMENT '总需打卡次数',
    `assigned_by`     BIGINT UNSIGNED DEFAULT NULL COMMENT '布置人(教师ID)',
    `semester_id`     BIGINT UNSIGNED NOT NULL,
    `created_at`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_student` (`student_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_due` (`due_date`),
    INDEX `idx_type` (`task_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务';

-- 任务打卡记录表
CREATE TABLE IF NOT EXISTS `task_checkin` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `task_id`         BIGINT UNSIGNED NOT NULL,
    `student_id`      BIGINT UNSIGNED NOT NULL,
    `checkin_by`      VARCHAR(20)  NOT NULL COMMENT '打卡人: 家长/学生/老师',
    `checkin_time`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `remark`          VARCHAR(200) DEFAULT NULL COMMENT '打卡备注',
    `evidence_urls`   JSON         DEFAULT NULL COMMENT '证据图片URL列表',
    `created_at`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_task` (`task_id`),
    INDEX `idx_student` (`student_id`),
    INDEX `idx_time` (`checkin_time` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务打卡记录';

-- 请假申请表
CREATE TABLE IF NOT EXISTS `leave_application` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`      BIGINT UNSIGNED NOT NULL,
    `parent_id`       BIGINT UNSIGNED NOT NULL COMMENT '提交人(家长)',
    `leave_type`      VARCHAR(20)  NOT NULL COMMENT '病假/事假/公假',
    `start_date`      DATE         NOT NULL,
    `end_date`        DATE         NOT NULL,
    `total_days`      DECIMAL(4,1) NOT NULL COMMENT '请假总天数',
    `reason`          TEXT         NOT NULL COMMENT '请假原因',
    `contact_phone`   VARCHAR(20)  NOT NULL COMMENT '家长联系电话',
    `attachment_urls` JSON         DEFAULT NULL COMMENT '附件JSON数组',
    `status`          VARCHAR(20)  DEFAULT '待审批' COMMENT '待审批/已批准/已驳回/已撤销',
    `approver_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '审批人',
    `approve_remark`  VARCHAR(500) DEFAULT NULL COMMENT '审批意见',
    `approve_time`    DATETIME     DEFAULT NULL COMMENT '审批时间',
    `semester_id`     BIGINT UNSIGNED NOT NULL,
    `created_at`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_student` (`student_id`),
    INDEX `idx_parent` (`parent_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='请假申请';

-- 学校活动表
CREATE TABLE IF NOT EXISTS `school_activity` (
    `id`                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title`                 VARCHAR(100) NOT NULL COMMENT '活动标题',
    `description`           TEXT         NOT NULL COMMENT '活动详情',
    `activity_type`         VARCHAR(20)  NOT NULL COMMENT '文体活动/家长会/开放日/讲座/比赛/社会实践/其他',
    `location`              VARCHAR(200) DEFAULT NULL,
    `start_time`            DATETIME     NOT NULL,
    `end_time`              DATETIME     NOT NULL,
    `registration_deadline` DATETIME     DEFAULT NULL COMMENT '报名截止时间',
    `max_participants`      INT          DEFAULT 0 COMMENT '0表示不限',
    `current_count`         INT          DEFAULT 0 COMMENT '当前报名人数',
    `cover_image`           VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
    `gallery_urls`          JSON         DEFAULT NULL COMMENT '活动相册JSON',
    `status`                VARCHAR(20)  DEFAULT '报名中' COMMENT '报名中/进行中/已结束/已取消',
    `publisher_id`          BIGINT UNSIGNED NOT NULL COMMENT '发布人',
    `semester_id`           BIGINT UNSIGNED NOT NULL,
    `created_at`            DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`activity_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_time` (`start_time`),
    FULLTEXT INDEX `ft_description` (`title`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学校活动';

-- 活动报名表
CREATE TABLE IF NOT EXISTS `activity_registration` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `activity_id`  BIGINT UNSIGNED NOT NULL,
    `student_id`   BIGINT UNSIGNED NOT NULL,
    `parent_id`    BIGINT UNSIGNED NOT NULL COMMENT '报名人(家长)',
    `status`       VARCHAR(20) DEFAULT '已报名' COMMENT '已报名/已取消/已签到',
    `remark`       VARCHAR(200) DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_activity_student` (`activity_id`, `student_id`),
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动报名';

-- 历史档案表
CREATE TABLE IF NOT EXISTS `archive_record` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`      BIGINT UNSIGNED NOT NULL,
    `semester_id`     BIGINT UNSIGNED NOT NULL,
    `archive_type`    VARCHAR(20)  NOT NULL COMMENT '期末档案/学年档案/毕业档案',
    `summary`         TEXT         COMMENT '综合评价总结',
    `attendance_rate` DECIMAL(5,2) DEFAULT NULL COMMENT '出勤率',
    `total_score`     DECIMAL(5,2) DEFAULT NULL COMMENT '总分/平均分',
    `rank`            INT          DEFAULT NULL COMMENT '班级排名',
    `evaluation_data` JSON         COMMENT '归档数据快照',
    `is_published`    TINYINT      DEFAULT 0 COMMENT '是否已发布给家长',
    `published_at`    DATETIME     DEFAULT NULL,
    `created_at`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_student_semester_type` (`student_id`, `semester_id`, `archive_type`),
    INDEX `idx_semester` (`semester_id`),
    INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='历史档案';

-- 通知表
CREATE TABLE IF NOT EXISTS `notification` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id`    BIGINT UNSIGNED NOT NULL,
    `student_id`   BIGINT UNSIGNED DEFAULT NULL COMMENT '相关学生',
    `type`         VARCHAR(30)  NOT NULL COMMENT '通知类型',
    `title`        VARCHAR(100) NOT NULL COMMENT '通知标题',
    `brief`        VARCHAR(200) DEFAULT NULL COMMENT '摘要',
    `data_json`    JSON         DEFAULT NULL COMMENT '相关数据',
    `is_read`      TINYINT      DEFAULT 0,
    `read_at`      DATETIME     DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_parent_read` (`parent_id`, `is_read`),
    INDEX `idx_student` (`student_id`),
    INDEX `idx_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知';

-- 搜索文档表（RAG用）
CREATE TABLE IF NOT EXISTS `search_document` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `student_id`    BIGINT UNSIGNED NOT NULL,
    `doc_type`      VARCHAR(30)  NOT NULL COMMENT 'evaluation/honor/task/leave/activity/archive',
    `source_id`     BIGINT UNSIGNED NOT NULL COMMENT '源纪录ID',
    `title`         VARCHAR(200) NOT NULL COMMENT '文档标题',
    `content`       TEXT         NOT NULL COMMENT '文档正文',
    `embedding_id`  VARCHAR(64)  DEFAULT NULL COMMENT '向量ID',
    `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FULLTEXT INDEX `ft_content` (`content`),
    INDEX `idx_student` (`student_id`),
    INDEX `idx_type` (`doc_type`),
    INDEX `idx_source` (`doc_type`, `source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='搜索文档';

-- ============================================================
-- 初始数据
-- ============================================================

-- 当前学期
INSERT INTO `semester` (`code`, `name`, `start_date`, `end_date`, `is_current`) VALUES
('2025-2026-2', '2025-2026学年第二学期', '2026-02-15', '2026-07-10', 1);

-- 测试班级
INSERT INTO `class` (`name`, `grade`) VALUES
('三年级一班', 3), ('三年级二班', 3);

-- 测试教师
INSERT INTO `teacher` (`uuid`, `name`, `phone`, `subject`, `title`) VALUES
('tchr-001', '李老师', '13800001111', '数学', '高级教师'),
('tchr-002', '王老师', '13800002222', '语文', '一级教师'),
('tchr-003', '张老师', '13800003333', '英语', '二级教师');
