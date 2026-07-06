// ---------- 核心数据模型（v2 三层架构）----------
// L1 导演选择层：结构化选项（本文件 + data/options.ts）
// L2 AI 翻译层：lib/ai.ts —— 读剧本 + 收 L1 选项，写成具体句子
// L3 视频生成层：Seedance / 即梦，只吃 L2 输出

/** 词库分组：A 站位 / B 灯光 / C 表演情绪 / D 动作 / S 运镜其他 */
export type LibGroup = 'A' | 'B' | 'C' | 'D' | 'S'

/** 选项取值 */
export interface OptionValue {
  id: string
  /** 导演看的中文标签，例如「前倾坐·肘撑膝」 */
  label: string
  /** L2 拼句用的翻译提示（中文肌肉/空间描述或英文关键词） */
  ai: string
}

/** 一个可选维度（= 网站上一组按钮 / 一个下拉框） */
export interface OptionDimension {
  key: string
  /** 维度名，例如「九宫格位置」 */
  label: string
  /** 所属词库分组 */
  group: LibGroup
  /** 可选值（第一个通常是 N/A） */
  values: OptionValue[]
  /** 是否多选（例如光影形态、群演反应） */
  multi?: boolean
  /** 维度说明 / 避坑提示 */
  hint?: string
}

/** 导演在某镜头各维度上的选择（存 OptionValue.id 列表） */
export type ShotSelections = Record<string, string[]>

/** 一个镜头/分镜 */
export interface Shot {
  id: string
  /** 顺序号，从 1 开始 */
  order: number
  /** 本镜头对应的剧本原文（可由多行合并而来） */
  scriptSegment: string
  /** 导演口述：这段对应哪段剧情 + 想怎么设计（可选填，L2 会参考/拆解） */
  directorNote: string
  /** 绑定物/空间锚点自由描述（可选，例如「后背贴沙发左扶手」） */
  anchorNote: string
  /** 各维度的结构化选择 */
  selections: ShotSelections
  /** 群演/背景层登记表（每条 = 一个背景人物「身份+位置」，随剧本生成） */
  extras: string[]
  /** 导演逐镜审核清单勾选状态（key = 审核项 id） */
  checklist: Record<string, boolean>
  /** 本镜头分配到的时长（秒） */
  duration: number
  /** L2 生成的分镜提示词（点「AI 生成」后填充；缓存起来避免重复调用） */
  aiOutput?: string
  /** 导演对上一版视频效果的反馈（用于 L2 迭代） */
  feedback?: string
}

/** 目标平台 */
export interface Platform {
  id: string
  label: string
  note: string
}

/** 时长上限选项（单个分镜总时长 ≤ 14s，这里给常见的输入切片档） */
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
  /** 影调风格参考（如「《继承之战》冷峻资本气质」），进头部块 */
  toneRef: string
  /** 拆分出的镜头 */
  shots: Shot[]
  updatedAt: number
}

/** L2 调用配置（API key 存本地） */
export interface AiConfig {
  apiKey: string
}
