package com.campuseval.llm;

/**
 * LLM 调用抽象接口
 *
 * 实现类: QwenLLMClient / DeepSeekLLMClient
 */
public interface LLMClient {

    /**
     * 对话补全（非流式）
     * @param systemPrompt  系统提示词
     * @param userMessage   用户消息
     * @param maxTokens     最大输出 token
     * @param temperature   温度（0-1，意图分类用0.1，回复生成用0.7）
     * @return 模型返回的文本
     */
    String chat(String systemPrompt, String userMessage, int maxTokens, double temperature);

    /**
     * 获取模型名称
     */
    String getModelName();
}
