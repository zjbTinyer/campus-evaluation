/**
 * 微信 JS-SDK 封装
 *
 * 在微信内置浏览器中提供:
 * - 用户授权获取 openid
 * - 分享到朋友圈/好友
 * - 图片预览
 * - 地理位置获取（活动签到用）
 */

// 微信 JS-SDK 类型声明
declare global {
  interface Window {
    wx?: {
      config: (config: WxConfig) => void
      ready: (callback: () => void) => void
      error: (callback: (err: unknown) => void) => void
      checkJsApi: (opts: {
        jsApiList: string[]
        success?: (res: unknown) => void
      }) => void
      updateAppMessageShareData: (opts: ShareData) => void
      updateTimelineShareData: (opts: ShareData) => void
      previewImage: (opts: { current: string; urls: string[] }) => void
      getLocation: (opts: {
        type?: string
        success?: (res: { latitude: number; longitude: number }) => void
        fail?: (err: unknown) => void
      }) => void
    }
  }
}

interface WxConfig {
  debug: boolean
  appId: string
  timestamp: number
  nonceStr: string
  signature: string
  jsApiList: string[]
}

interface ShareData {
  title: string
  desc: string
  link: string
  imgUrl: string
  success?: () => void
}

/**
 * 检测是否在微信内置浏览器中
 */
export function isInWechat(): boolean {
  return /micromessenger/i.test(navigator.userAgent)
}

/**
 * 初始化微信 JS-SDK
 *
 * @param appId     微信公众号 AppID
 * @param signature 后端签名（需要后端提供 /api/v1/wechat/signature 接口）
 */
export async function initWxSDK(appId: string): Promise<boolean> {
  if (!isInWechat() || !window.wx) {
    console.log('[WeChat] 非微信环境或 JS-SDK 未加载')
    return false
  }

  try {
    // 从后端获取签名配置
    const token = localStorage.getItem('token')
    const res = await fetch('/api/v1/wechat/signature', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const { data } = await res.json()

    window.wx.config({
      debug: false,
      appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'previewImage',
        'getLocation',
      ],
    })

    return new Promise((resolve) => {
      window.wx!.ready(() => {
        console.log('[WeChat] JS-SDK 初始化成功')
        resolve(true)
      })
      window.wx!.error((err: unknown) => {
        console.error('[WeChat] JS-SDK 初始化失败', err)
        resolve(false)
      })
    })
  } catch (e) {
    console.error('[WeChat] 获取签名失败', e)
    return false
  }
}

/**
 * 设置分享信息
 */
export function setShareInfo(title: string, desc: string, link: string, imgUrl?: string) {
  if (!isInWechat() || !window.wx) return

  const shareData: ShareData = {
    title,
    desc,
    link,
    imgUrl: imgUrl || window.location.origin + '/favicon.svg',
  }

  window.wx.ready(() => {
    window.wx!.updateAppMessageShareData(shareData)
    window.wx!.updateTimelineShareData(shareData)
  })
}

/**
 * 预览图片（微信环境使用原生预览，非微信使用浏览器默认行为）
 */
export function previewImages(urls: string[], current?: string) {
  if (isInWechat() && window.wx) {
    window.wx.ready(() => {
      window.wx!.previewImage({
        current: current || urls[0],
        urls,
      })
    })
  } else {
    // 非微信环境：打开新窗口预览
    window.open(current || urls[0], '_blank')
  }
}
