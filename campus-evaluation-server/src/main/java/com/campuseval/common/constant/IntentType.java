package com.campuseval.common.constant;

/**
 * 意图类型常量
 */
public class IntentType {

    private IntentType() {}

    // === QUERY 意图 (READ) ===
    public static final String QUERY_EVALUATION  = "QUERY_EVALUATION";
    public static final String QUERY_HONOR       = "QUERY_HONOR";
    public static final String QUERY_TASK        = "QUERY_TASK";
    public static final String QUERY_LEAVE       = "QUERY_LEAVE";
    public static final String QUERY_ACTIVITY    = "QUERY_ACTIVITY";
    public static final String QUERY_ARCHIVE     = "QUERY_ARCHIVE";
    public static final String QUERY_OVERVIEW    = "QUERY_OVERVIEW";

    // === ACTION 意图 (WRITE) ===
    public static final String ACTION_CHECKIN            = "ACTION_CHECKIN";
    public static final String ACTION_SUBMIT_LEAVE       = "ACTION_SUBMIT_LEAVE";
    public static final String ACTION_REGISTER_ACTIVITY  = "ACTION_REGISTER_ACTIVITY";

    // === NAVIGATE 意图 ===
    public static final String NAVIGATE_EVALUATIONS = "NAVIGATE_EVALUATIONS";
    public static final String NAVIGATE_HONORS      = "NAVIGATE_HONORS";
    public static final String NAVIGATE_TASKS       = "NAVIGATE_TASKS";
    public static final String NAVIGATE_LEAVES      = "NAVIGATE_LEAVES";
    public static final String NAVIGATE_ACTIVITIES  = "NAVIGATE_ACTIVITIES";
    public static final String NAVIGATE_ARCHIVE     = "NAVIGATE_ARCHIVE";
}
