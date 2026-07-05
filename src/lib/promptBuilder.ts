import type { Project, Shot } from '../types'
import { DIMENSIONS_BY_GROUP, GROUP_LABEL, GROUP_ORDER, valueOf } from '../data/options'

/** 收集某镜某维度已选的取值（跳过 N/A） */
function picked(shot: Shot, dimKey: string): { label: string; ai: string }[] {
  const dim = [...DIMENSIONS_BY_GROUP.A, ...DIMENSIONS_BY_GROUP.B, ...DIMENSIONS_BY_GROUP.C, ...DIMENSIONS_BY_GROUP.D, ...DIMENSIONS_BY_GROUP.S].find(
    (d) => d.key === dimKey,
  )
  if (!dim) return []
  const ids = (shot.selections[dimKey] ?? []).filter((id) => id !== 'na')
  return ids.map((id) => valueOf(dimKey, id)).filter(Boolean).map((v) => ({ label: v!.label, ai: v!.ai }))
}

/** 人类可读版：导演一眼看懂的分组中文摘要 */
export function humanReadable(shot: Shot): string {
  const lines: string[] = []
  for (const g of GROUP_ORDER) {
    const parts: string[] = []
    for (const dim of DIMENSIONS_BY_GROUP[g]) {
      const vals = picked(shot, dim.key)
      if (vals.length) parts.push(`${dim.label}：${vals.map((v) => v.label).join('/')}`)
    }
    if (parts.length) lines.push(`${GROUP_LABEL[g]}\n　${parts.join('　·　')}`)
  }
  return lines.length ? lines.join('\n') : '（尚未勾选任何选项）'
}

/** 拼一行「维度：ai值」文本 */
function aiLine(shot: Shot, dimKey: string): string {
  return picked(shot, dimKey)
    .map((v) => v.ai)
    .filter(Boolean)
    .join('；')
}

/**
 * 本地草稿（无 AI）：按统一格式尽力拼一个镜头块。
 * 点「AI 生成」后会被 L2 的高质量输出替换（存到 shot.aiOutput）。
 */
export function localShotDraft(shot: Shot): string {
  const plot = shot.scriptSegment.trim() || '（空）'
  const note = shot.directorNote.trim()

  const station = [
    aiLine(shot, 'grid'),
    aiLine(shot, 'depth'),
    aiLine(shot, 'ratio'),
    shot.anchorNote.trim(),
    aiLine(shot, 'posture'),
    aiLine(shot, 'facing'),
    aiLine(shot, 'eyeline'),
  ]
    .filter(Boolean)
    .join('；')

  const light = [
    aiLine(shot, 'lightPreset'),
    aiLine(shot, 'lightSource'),
    aiLine(shot, 'lightTime'),
    aiLine(shot, 'lightArtificial'),
    aiLine(shot, 'lightDir'),
    aiLine(shot, 'lightAngle'),
    aiLine(shot, 'lightSoft'),
    aiLine(shot, 'lightColor'),
    aiLine(shot, 'lightContrast'),
    aiLine(shot, 'lightShape'),
  ]
    .filter(Boolean)
    .join('；')

  const perform = [aiLine(shot, 'emotion'), aiLine(shot, 'intensity')].filter(Boolean).join('；')

  const action = [
    aiLine(shot, 'shotSize'),
    aiLine(shot, 'action'),
    aiLine(shot, 'actBody'),
    aiLine(shot, 'actAmp'),
    aiLine(shot, 'actPath'),
    aiLine(shot, 'actSpeed'),
    aiLine(shot, 'actForce'),
    aiLine(shot, 'camera'),
    aiLine(shot, 'angle'),
  ]
    .filter(Boolean)
    .join('；')

  const lines = [
    `### 镜头${shot.order}`,
    `${shot.duration || 0}s`,
    `[衔接锁] ${shot.order === 1 ? '起始镜，无需承接。' : '承接上一镜落幅：姿态/站位/手部/道具归属/光线不变；建议以上一条尾帧图作首帧。'}`,
    `[剧情] ${plot}`,
    note ? `[导演意图] ${note}` : '',
    `[站位] ${station || '（待 AI 补全空间锚定四件套）'}`,
    `[动作] ${action || '（待定）'}`,
    `[表演] ${perform || '（待 AI 翻译为肌肉+过程）'}${perform ? '；面部紧致平滑，无法令纹，无五官移位，避免夸张僵硬橡皮脸' : ''}`,
    `[打光] ${light || '（待 AI 展开光线签名块）'}`,
    `[SCENE AUDIT] （待 AI 依剧本派活）`,
  ]
  return lines.filter(Boolean).join('\n')
}

/** 头部信息块（第六部分 6.1，尽力从项目信息填充） */
function headerBlock(project: Project): string {
  return [
    `【视频中不得出现任何字幕、文字叠加、纯画面，不要 bgm，不要配乐】`,
    `【画风】：写实通用`,
    `【基础定调】：真人实拍电影质感，photo-realistic，35mm 胶片颗粒，浅景深，高动态范围，影院级打光；皮肤真实有细节；画面精致高级，无畸变无倾斜无变形`,
    `【表演要求】：情绪细腻饱满，过渡自然`,
    `【影调风格】：${project.toneRef || '（贴合剧种的参考电影名）'}`,
    `【场景/道具/光线签名块】：由 L2 依剧本与首镜灯光选项统一生成后每镜复述`,
    `【负向词】：避免抖动，避免肢体扭曲，避免时间闪烁，避免身份漂移，避免背景人物消失或移位，避免光线跳变，避免夸张僵硬表情`,
  ].join('\n')
}

/** 单镜最终文本：优先 L2 输出，否则本地草稿 */
export function shotFinalText(shot: Shot): string {
  return shot.aiOutput?.trim() ? shot.aiOutput.trim() : localShotDraft(shot)
}

/** 整片完整分镜（头部块 + 各镜头块，统一格式） */
export function buildFullPrompt(project: Project): string {
  const header = `# ${project.title || '未命名项目'}　|　平台：${project.platformId}　|　单条上限：${project.durationLimit}s\n`
  const body = project.shots.map((s) => shotFinalText(s)).join('\n\n')
  const total = project.shots.reduce((sum, s) => sum + (s.duration || 0), 0)
  return `${header}\n${headerBlock(project)}\n\n${body}\n\n共计${total}s`
}
