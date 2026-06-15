package com.campuseval.search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 搜索服务 — 整合 MySQL FULLTEXT + Elasticsearch
 *
 * 策略：
 * - 结构化查询 → 直接 SQL/MyBatis 精确查询（走 Service 层）
 * - 模糊查询/全文检索 → ES > MySQL FULLTEXT（降级链）
 */
@Service
public class SearchService {

    private static final Logger log = LoggerFactory.getLogger(SearchService.class);

    /**
     * 混合搜索：全文 + 语义
     *
     * TODO: 实现 ES 客户端调用
     * TODO: 实现 MySQL FULLTEXT 降级
     */


    /**
     * 重建索引：一条数据变更后，重新生成 search_document 并同步到 ES
     */
    public void indexDocument(Long studentId, String docType, Long sourceId,
                               String title, String content) {
        log.debug("[SearchService] 索引文档: studentId={}, type={}, sourceId={}, title={}",
                studentId, docType, sourceId, title);

        // 1. Upsert MySQL search_document 表
        // searchDocumentMapper.upsert(studentId, docType, sourceId, title, content);

        // 2. Index to Elasticsearch
        // indexToES(studentId, docType, sourceId, title, content);
    }

    /**
     * 全文搜索
     * @param query    搜索词
     * @param studentId 限定学生
     * @param docTypes  限定文档类型
     * @param limit     返回条数
     * @return 匹配的 search_document 列表
     */
    public List<Map<String, Object>> fulltextSearch(String query, Long studentId,
                                                     List<String> docTypes, int limit) {
        log.debug("[SearchService] 全文搜索: query=\"{}\", studentId={}, types={}",
                query, studentId, docTypes);

        // TODO: ES search → MySQL FULLTEXT fallback
        // 当前返回空列表
        return Collections.emptyList();
    }

    /**
     * 语义搜索（向量相似度）
     * 需要先将 query embedding，然后 ES kNN 搜索
     */
    public List<Map<String, Object>> semanticSearch(String query, Long studentId, int limit) {
        log.debug("[SearchService] 语义搜索: query=\"{}\", studentId={}", query, studentId);

        // TODO: 调 embedding API → ES kNN search
        return Collections.emptyList();
    }

    /**
     * 删除文档索引（数据删除/下架时调用）
     */
    public void deleteDocument(String docType, Long sourceId) {
        log.debug("[SearchService] 删除索引: type={}, sourceId={}", docType, sourceId);
        // TODO: 标记删除 MySQL search_document 记录 + 从 ES 删除
    }
}
