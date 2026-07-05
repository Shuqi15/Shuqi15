import type { OptionDimension } from '../types'

/** N/A 通用取值：每个维度第一个都放它 */
const NA = { id: 'na', label: 'N/A（不适用）', ai: '' }

/**
 * 选项库：导演在每个镜头上可选择的结构化要素。
 * label = 给导演看的中文；ai = 拼进提示词给 AI 的描述。
 * 后续可继续扩充，AI 自动填选项时也从这里取值。
 */
export const DIMENSIONS: OptionDimension[] = [
  {
    key: 'shotSize',
    label: '景别',
    values: [
      NA,
      { id: 'ecu', label: '大特写', ai: 'extreme close-up' },
      { id: 'cu', label: '特写', ai: 'close-up shot' },
      { id: 'mcu', label: '近景', ai: 'medium close-up' },
      { id: 'ms', label: '中景', ai: 'medium shot' },
      { id: 'fs', label: '全景', ai: 'full shot' },
      { id: 'ws', label: '远景/大全景', ai: 'wide establishing shot' },
    ],
  },
  {
    key: 'angle',
    label: '机位/角度',
    values: [
      NA,
      { id: 'eye', label: '平视', ai: 'eye-level angle' },
      { id: 'high', label: '俯拍', ai: 'high angle looking down' },
      { id: 'low', label: '仰拍', ai: 'low angle looking up' },
      { id: 'ots', label: '过肩', ai: 'over-the-shoulder angle' },
      { id: 'pov', label: '主观视角', ai: 'first-person POV' },
      { id: 'birds', label: '顶拍', ai: "bird's-eye top-down view" },
    ],
  },
  {
    key: 'camera',
    label: '运镜',
    values: [
      NA,
      { id: 'static', label: '固定', ai: 'static locked-off camera' },
      { id: 'push', label: '推镜', ai: 'slow dolly push-in' },
      { id: 'pull', label: '拉镜', ai: 'dolly pull-out' },
      { id: 'pan', label: '横摇', ai: 'horizontal pan' },
      { id: 'track', label: '跟拍', ai: 'tracking shot following subject' },
      { id: 'handheld', label: '手持', ai: 'handheld shaky camera' },
    ],
  },
  {
    key: 'lighting',
    label: '灯光',
    values: [
      NA,
      { id: 'soft', label: '柔光', ai: 'soft diffused lighting' },
      { id: 'hard', label: '硬光', ai: 'hard directional lighting' },
      { id: 'backlit', label: '逆光', ai: 'backlit rim light' },
      { id: 'lowkey', label: '低调/暗调', ai: 'low-key moody lighting, deep shadows' },
      { id: 'highkey', label: '高调/明亮', ai: 'high-key bright even lighting' },
      { id: 'golden', label: '黄金时刻', ai: 'warm golden hour light' },
      { id: 'neon', label: '霓虹', ai: 'colorful neon lighting' },
    ],
  },
  {
    key: 'emotion',
    label: '人物情绪',
    values: [
      NA,
      { id: 'bittersmile', label: '苦笑', ai: 'bitter, forced smile' },
      { id: 'sad', label: '悲伤', ai: 'deep sadness, welling tears' },
      { id: 'angry', label: '愤怒', ai: 'anger, tense jaw' },
      { id: 'calm', label: '平静', ai: 'calm, composed expression' },
      { id: 'fear', label: '恐惧', ai: 'fear, wide eyes' },
      { id: 'joy', label: '喜悦', ai: 'genuine joy, bright smile' },
      { id: 'cold', label: '冷漠', ai: 'cold, indifferent gaze' },
      { id: 'shock', label: '震惊', ai: 'shocked, frozen expression' },
    ],
  },
  {
    key: 'extras',
    label: '群演反应',
    multi: true,
    values: [
      NA,
      { id: 'watch', label: '围观', ai: 'crowd watching intently' },
      { id: 'whisper', label: '窃窃私语', ai: 'onlookers whispering to each other' },
      { id: 'flee', label: '慌乱逃散', ai: 'crowd panicking and scattering' },
      { id: 'cheer', label: '欢呼', ai: 'crowd cheering' },
      { id: 'ignore', label: '无视/照常', ai: 'background people going about normally' },
      { id: 'block', label: '阻拦', ai: 'bystanders trying to intervene' },
    ],
  },
  {
    key: 'blocking',
    label: '站位/空间',
    values: [
      NA,
      { id: 'center', label: '居中', ai: 'subject centered in frame' },
      { id: 'left', label: '画左', ai: 'subject on left third' },
      { id: 'right', label: '画右', ai: 'subject on right third' },
      { id: 'faceoff', label: '正面对峙', ai: 'two subjects facing off frontally' },
      { id: 'backto', label: '背对', ai: 'subject with back to camera' },
      { id: 'foregroundbg', label: '前后景纵深', ai: 'one subject foreground, one deep background' },
    ],
  },
  {
    key: 'pace',
    label: '节奏/氛围',
    values: [
      NA,
      { id: 'tense', label: '紧张', ai: 'tense, suspenseful mood' },
      { id: 'slow', label: '舒缓', ai: 'slow, contemplative pace' },
      { id: 'fast', label: '快速凌厉', ai: 'fast, sharp cutting energy' },
      { id: 'warm', label: '温情', ai: 'warm, tender atmosphere' },
      { id: 'eerie', label: '诡异', ai: 'eerie, unsettling mood' },
    ],
  },
]

export const DIMENSION_BY_KEY: Record<string, OptionDimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
)

/** 每个新镜头的默认选择：所有维度默认 N/A */
export function defaultSelections(): Record<string, string[]> {
  const sel: Record<string, string[]> = {}
  for (const d of DIMENSIONS) sel[d.key] = ['na']
  return sel
}

/** 取某维度某 id 对应的取值 */
export function valueOf(dimKey: string, id: string) {
  return DIMENSION_BY_KEY[dimKey]?.values.find((v) => v.id === id)
}
