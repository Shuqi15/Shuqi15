import type { Project, Shot } from '../types'
import { DIMENSIONS, valueOf } from '../data/options'

/** 把一个镜头的所有选择收集成「维度 → 取值」列表（跳过 N/A 和空值） */
function collectPicked(shot: Shot): { label: string; ai: string; dimLabel: string }[] {
  const picked: { label: string; ai: string; dimLabel: string }[] = []
  for (const dim of DIMENSIONS) {
    const ids = shot.selections[dim.key] ?? []
    for (const id of ids) {
      if (id === 'na') continue
      const v = valueOf(dim.key, id)
      if (v && v.ai) picked.push({ label: v.label, ai: v.ai, dimLabel: dim.label })
    }
  }
  return picked
}

/** 人类可读版：导演一眼能看懂的中文摘要 */
export function humanReadable(shot: Shot): string {
  const picked = collectPicked(shot)
  const parts = picked.map((p) => `${p.dimLabel}：${p.label}`)
  const design = parts.length ? parts.join('　·　') : '（尚未设计，全部 N/A）'
  return design
}

/**
 * AI 可读版：按平台格式生成提示词。
 * 每个镜头都会带上对应的剧本原文剧情，方便导演回溯判断。
 */
export function buildAiPrompt(project: Project, shot: Shot): string {
  const picked = collectPicked(shot)
  const aiParts = picked.map((p) => p.ai)
  const plot = shot.scriptSegment.trim()
  const note = shot.directorNote.trim()

  switch (project.platformId) {
    case 'libtv':
      return [
        `【镜头 ${shot.order} · ${shot.duration}s】`,
        `剧情：${plot}`,
        note ? `导演意图：${note}` : '',
        `画面：${aiParts.join(', ') || 'director to decide'}`,
        `（参考图请用 @角色图 引用）`,
      ]
        .filter(Boolean)
        .join('\n')

    case 'juchuang': {
      // 结构化字段分行
      const lines = [`# 镜头 ${shot.order}（时长 ${shot.duration}s）`, `剧情原文：${plot}`]
      if (note) lines.push(`导演意图：${note}`)
      for (const p of picked) lines.push(`${p.dimLabel}：${p.ai}`)
      if (picked.length === 0) lines.push('画面：待定')
      return lines.join('\n')
    }

    case 'lingju':
      // 自然语言整段
      return (
        `第${shot.order}镜（约${shot.duration}秒）：` +
        `剧情为「${plot}」。` +
        (note ? `导演希望${note}。` : '') +
        (aiParts.length ? `画面呈现：${aiParts.join('，')}。` : '画面由 AI 自行设计。') +
        `参考图用【图${shot.order}】引用。`
      )

    default: // generic
      return [
        `Shot ${shot.order} | duration ${shot.duration}s`,
        `Plot: ${plot}`,
        note ? `Director intent: ${note}` : '',
        `Visual: ${aiParts.join(', ') || 'TBD'}`,
      ]
        .filter(Boolean)
        .join('\n')
  }
}

/** 整个项目的完整提示词（所有镜头拼接） */
export function buildFullPrompt(project: Project): string {
  const header = `# ${project.title || '未命名项目'}　|　平台：${project.platformId}　|　单条上限：${project.durationLimit}s\n`
  const body = project.shots.map((s) => buildAiPrompt(project, s)).join('\n\n---\n\n')
  return header + '\n' + body
}
