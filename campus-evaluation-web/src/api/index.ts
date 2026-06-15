/**
 * API 统一入口 — Mock/真实接口一键切换
 *
 * 切换方式（三选一，优先级从高到低）：
 * 1. URL 参数:    ?mock=false  强制走真实 API
 * 2. localStorage: localStorage.setItem('api_mode', 'real')
 * 3. 代码常量:    修改下方 USE_MOCK 默认值
 */

/** 默认 Mock 模式（改为 false 即走真实 API） */
const USE_MOCK = true

/** 检测是否 Mock 模式 */
export function isMockMode(): boolean {
  // URL 参数覆盖（最高优先级）
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const urlMock = params.get('mock')
    if (urlMock === 'false' || urlMock === '0') return false
    if (urlMock === 'true' || urlMock === '1') return true
  }
  // localStorage 覆盖
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('api_mode')
    if (stored === 'real') return false
    if (stored === 'mock') return true
  }
  // 默认值
  return USE_MOCK
}

/** 切换 API 模式（运行时动态切换） */
export function setApiMode(mode: 'mock' | 'real') {
  localStorage.setItem('api_mode', mode)
}

/** 获取当前 API 模式 */
export function getApiMode(): 'mock' | 'real' {
  return isMockMode() ? 'mock' : 'real'
}
