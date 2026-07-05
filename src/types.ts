// ---------- 核心数据模型 ----------

/** 选项维度的取值（每个维度都会包含一个 N/A） */
export interface OptionValue {
  id: string
  /** 导演看的中文标签，例如「苦笑」 */
  label: string
  /** 给 AI 的英文/描述性提示词，例如 "bitter forced smile" */
  ai: string
}

/** 一个可选维度，例如「景别」「情绪」 */
export interface OptionDimension {
  key: string
  /** 维度名，例如「景别」 */
  label: string
  /** 该维度的可选值（第一个通常是 N/A） */
  values: OptionValue[]
  /** 是否允许多选（例如人物、群演反应可多选） */
  multi?: boolean
}

/** 导演对某个镜头在各维度上的选择（存的是 OptionValue.id 列表） */
export type ShotSelections = Record<string, string[]>

/** 一个镜头/分镜 */
export interface Shot {
  id: string
  /** 顺序号，从 1 开始 */
  order: number
  /** 本镜头对应的剧本原文（可由多行合并而来） */
  scriptSegment: string
  /** 导演口述：这段想怎么设计（可选填） */
  directorNote: string
  /** 各维度的结构化选择 */
  selections: ShotSelections
  /** 本镜头分配到的时长（秒），受项目时长上限约束 */
  duration: number
}

/** 目标平台（不同平台提示词格式略有差异） */
export interface Platform {
  id: string
  label: string
  /** 平台简介 / @图片方式说明 */
  note: string
}

/** 时长上限选项 */
export type DurationLimit = 10 | 15 | 30

/** 整个项目 */
export interface Project {
  id: string
  title: string
  /** 原始剧本全文 */
  scriptText: string
  /** 目标平台 id */
  platformId: string
  /** 单条视频时长上限（秒） */
  durationLimit: DurationLimit
  /** 拆分出的镜头 */
  shots: Shot[]
  updatedAt: number
}
