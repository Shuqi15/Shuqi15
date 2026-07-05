import type { Platform } from '../types'

/**
 * 目标视频生成平台（L3）。不同平台图片引用/提示词格式略有差异，
 * 差异在 L2 生成时按 platformId 处理。
 */
export const PLATFORMS: Platform[] = [
  {
    id: 'seedance',
    label: 'Seedance',
    note: '偏自然语言整段影视化描述，中英双语提示词。',
  },
  {
    id: 'jimeng',
    label: '即梦',
    note: '支持 @图片N / @视频N 引用：@图片1 作首帧人物站位，@图片2 参考背景，@视频1 参考运镜。',
  },
  {
    id: 'generic',
    label: '通用',
    note: '不针对特定平台，输出统一分镜格式。',
  },
]

export const PLATFORM_BY_ID: Record<string, Platform> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
)
