package com.campuseval;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 校园评价系统 — 启动入口
 *
 * @author campus-eval
 */
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class CampusEvaluationApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusEvaluationApplication.class, args);
    }
}
