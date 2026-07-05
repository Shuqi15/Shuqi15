import type { Platform } from '../types'

/**
 * 目标平台。不同平台提示词格式 / @图片方式略有差异，
 * 实际拼装差异在 lib/promptBuilder.ts 里按 platformId 处理。
 */
export const PLATFORMS: Platform[] = [
  {
    id: 'libtv',
    label: 'LibTV',
    note: '偏影视化描述，支持在提示词中用 @角色图 引用参考图。',
  },
  {
    id: 'juchuang',
    label: '剧创',
    note: '结构化字段更清晰，镜头/景别/情绪分行书写。',
  },
  {
    id: 'lingju',
    label: '灵剧',
    note: '偏自然语言整段描述，图片用【图N】占位引用。',
  },
  {
    id: 'generic',
    label: '通用',
    note: '不针对特定平台，输出结构化通用提示词。',
  },
]

export const PLATFORM_BY_ID: Record<string, Platform> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
)
