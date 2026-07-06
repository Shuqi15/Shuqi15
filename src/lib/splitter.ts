import type { DurationLimit, Shot } from '../types'
import { defaultSelections } from '../data/options'
import { uid } from './id'

/**
 * 规则版剧本拆分（阶段 1）。
 * 按中文/英文句末标点和换行把剧本切成句子，每句先各自成为一个镜头。
 * 阶段 3 会接入 Claude API 做更聪明的语义拆分，这里保留同样的输出结构。
 */
export function splitScript(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n')
  const segments: string[] = []
  // 先按换行分段，再按句末标点切
  for (const line of normalized.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    // 在句末标点后切分，保留标点
    const parts = trimmed
      .split(/(?<=[。！？!?；;])/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length === 0) segments.push(trimmed)
    else segments.push(...parts)
  }
  return segments
}

/**
 * 根据时长上限，给一组镜头平均分配每镜时长。
 * 例如 30s 上限、6 个镜头 → 每镜 5s（最少 2s，向下取整后把余数补给前面的镜头）。
 */
export function allocateDurations(count: number, limit: DurationLimit): number[] {
  if (count <= 0) return []
  const minPer = 2
  const maxShots = Math.max(1, Math.floor(limit / minPer))
  const effective = Math.min(count, maxShots)
  const base = Math.floor(limit / effective)
  const remainder = limit - base * effective
  const result: number[] = []
  for (let i = 0; i < count; i++) {
    if (i >= effective) {
      result.push(0) // 超出时长能容纳的镜头数，标 0 提示导演需要合并/删减
    } else {
      result.push(base + (i < remainder ? 1 : 0))
    }
  }
  return result
}

/** 新建一个空白镜头（承载一段剧本原文） */
export function makeShot(seg: string, order: number, duration: number): Shot {
  return {
    id: uid('shot'),
    order,
    scriptSegment: seg,
    directorNote: '',
    anchorNote: '',
    selections: defaultSelections(),
    extras: [],
    checklist: {},
    duration,
  }
}

/** 从一组剧本片段构建镜头（AI 拆分/规则拆分共用） */
export function shotsFromSegments(segments: string[], limit: DurationLimit): Shot[] {
  const durations = allocateDurations(segments.length, limit)
  return segments.map((seg, i) => makeShot(seg, i + 1, durations[i]))
}

/** 从剧本文本直接构建一组镜头（规则版拆分） */
export function buildShots(text: string, limit: DurationLimit): Shot[] {
  return shotsFromSegments(splitScript(text), limit)
}

/** 重新编号并重新分配时长（合并/拆分/删除后调用） */
export function renumberAndReallocate(shots: Shot[], limit: DurationLimit): Shot[] {
  const durations = allocateDurations(shots.length, limit)
  return shots.map((s, i) => ({ ...s, order: i + 1, duration: durations[i] }))
}
