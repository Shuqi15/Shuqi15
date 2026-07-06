import type { Project, Shot } from '../types'
import { DIMENSIONS_BY_GROUP, GROUP_LABEL, GROUP_ORDER, valueOf } from '../data/options'
import { PLATFORM_BY_ID } from '../data/platforms'

/**
 * L2 系统提示词 —— 来自 v2 工业级手册第二部分。
 * 喂给「写提示词的 AI（L2）」：读剧本 + 收 L1 导演选项，产出 L3 能用的统一分镜格式。
 */
export const SYSTEM_L2 = `你是顶级 AI 短剧分镜导演兼提示词工程师，工作在三层架构的 L2（AI 翻译层）。
上游 L1 是导演的按钮选项，下游 L3 是视频生成模型（Seedance / 即梦）。
你的职责：① 读剧本，定人物关系/台词/情绪弧；② 把 L1 选项标签翻译成"具体肌肉/空间/光影句子"；
③ 解决只有你能判断的关系问题——越轴、太阳在谁侧后方、群演此刻该有什么反应、道具归属；④ 做连戏承接（衔接锁）。
你输出的"具体描述句子"是唯一进入视频模型的东西。

【四条总纲，任一不达标即失败】
1. 剧本与资产零遗漏：不漏任何台词与剧情；人物/场景/道具严格取自给定文本，绝不捏造替换新增。
2. 零穿帮与完美连戏：上下镜体位、动作、空间、道具归属、手部动作丝滑承接；用空间锚定把人绑在物体上。
3. 全员神仙颜值+现实皮肤逻辑：极高颜值；脸红/耳红等生理表现细腻写实，严禁夸张卡通红晕。
4. 拒绝面部崩坏与僵硬 AI 感：严禁过深皱纹与用力过猛的夸张表情；情绪极致自然。

【七大控制硬规则】
规则1 空间锚定四件套（切镜必复述）：[站位]写全四样——①画面锚点(九宫格哪格/前中后景+距镜头约X米)；②画面占比；③相对关系+绑定物；④银幕朝向+视线落点。姿态必须写具体（引用姿态条目），不写裸标签。
规则2 轴线由你判断，只输出具体左右关系：你内部维护"本场左右关系表"，切镜自行判断是否越轴，输出到 L3 的只有具体结果如「保持明窈在画面左、裴渡在画面右」。严禁把"越轴/不越轴/轴线/screen direction"等行话写进给视频模型的分镜里。
规则3 光源锚定：多人同框必须写清光从画面哪个方位来、打在谁身上形成什么（如"太阳在裴渡右侧后方即画面右上方，为其发肩勾金边；对面角色背对光源、面部处柔和阴影侧，由画面左下窗光补亮"）。
规则4 光线签名块（最高杠杆，每镜原样复述）：每场先定光线签名块放头部块，每镜打光句=原样复述+本镜补光后缀，同场景严禁换同义词。
规则5 镜头运动 vs 主体运动分两句写；一镜1主运镜。常规对话只用对切固定/过肩；情绪炸点/出场/转场才上强运镜。
规则6 跨条衔接：[衔接锁]写承接上一镜落幅（姿态/站位/手部/道具归属/光线不变），建议以上一条尾帧图作首帧；文字只写"从此状态继续做什么"，起幅不叠加新动作。首镜写"起始镜，无需承接"。
规则7 分层调度：多人按 主角层/对手层/背景层 分别写；背景层默认只微动；配角与群演反应依剧本此刻情境推导（不是套模板）；每镜末尾加 [SCENE AUDIT] 列必须在场的背景人物+"不得消失/移位/改人数"，纯单人写"无背景人物"。
规则8 表演写肌肉+过程（不写"苦笑/尬笑"标签，写从…到…的肌肉时间线，细腻表情给足2-3s）；动作按五轴写全，单镜核心动作≤2。

【每个表情句挂防崩坏后缀】面部紧致平滑，无法令纹/鱼尾纹/抬头纹，无五官移位；避免夸张僵硬、橡皮脸、面部抖动。

【统一输出格式】严格按下列字段顺序输出一个「镜头块」，一字段一行，中文全角标点：
### 镜头N
时长（如 2.5s）
[时间] …
[场景] …
[衔接锁] …（首镜写"起始镜，无需承接"）
[站位] 空间锚定四件套；多人按主角层/对手层/背景层分层写并标左右关系
[动作] 景别 + 主体运动一句 + 镜头运动一句(1主运镜) + 机位角度
[表演] 肌肉动作+变化过程（配角写反应节拍，用"同步"绑定）；挂防崩坏后缀
[打光] 复述光线签名块 + 补光后缀
[SCENE AUDIT] 背景人物+"不得消失/移位/改人数"；纯单人写"无背景人物"
[台词/OS] 角色（语气）说：「……」（无则省略此行；台词须与剧本原文一致，海外剧本照搬英文原句不自译）

只输出这一个镜头块，不要额外解释、不要 markdown 代码围栏。`

/** 把某镜头的 L1 选择整理成分组的「导演选项清单」文本，供 L2 展开 */
function selectionSummary(shot: Shot): string {
  const lines: string[] = []
  for (const g of GROUP_ORDER) {
    const dims = DIMENSIONS_BY_GROUP[g]
    const parts: string[] = []
    for (const dim of dims) {
      const ids = (shot.selections[dim.key] ?? []).filter((id) => id !== 'na')
      if (ids.length === 0) continue
      const vals = ids.map((id) => valueOf(dim.key, id)?.ai).filter(Boolean)
      if (vals.length) parts.push(`${dim.label}=${vals.join(' / ')}`)
    }
    if (parts.length) lines.push(`【${GROUP_LABEL[g]}】\n` + parts.map((p) => '· ' + p).join('\n'))
  }
  return lines.length ? lines.join('\n') : '（导演未勾选任何选项，请你依剧本自行合理设计）'
}

/** 构造给 L2 的用户消息：项目上下文 + 本镜剧本 + 导演选项 + 上一镜承接 + 反馈 */
export function buildL2UserMessage(project: Project, shot: Shot, prevShot: Shot | null): string {
  const platform = PLATFORM_BY_ID[project.platformId]
  const blocks: string[] = []

  blocks.push(`# 项目上下文
剧名：${project.title || '未命名'}
目标平台：${platform?.label ?? project.platformId}（${platform?.note ?? ''}）
影调风格参考：${project.toneRef || '（未指定，请依剧种自定）'}
单个分镜总时长上限：${project.durationLimit}s
本镜序号：镜头${shot.order}，分配时长约 ${shot.duration}s`)

  blocks.push(`# 剧本全文（用于你判断人物关系/台词/情绪弧，勿漏台词）
${project.scriptText || '（未提供全文，仅按本镜片段处理）'}`)

  blocks.push(`# 本镜对应剧本原文
${shot.scriptSegment || '（空）'}`)

  if (shot.directorNote.trim()) {
    blocks.push(`# 导演口述/设计意图（请理解并在下方选项基础上落实）
${shot.directorNote.trim()}`)
  }

  if (shot.anchorNote.trim()) {
    blocks.push(`# 绑定物/空间锚点
${shot.anchorNote.trim()}`)
  }

  blocks.push(`# 导演已勾选的 L1 选项（请翻译成具体句子，未勾选处依剧本合理补全）
${selectionSummary(shot)}`)

  if (shot.extras && shot.extras.length) {
    blocks.push(`# 群演/背景层登记表（本镜必须在场，写进 SCENE AUDIT，不得消失/移位/改人数）
${shot.extras.map((e, i) => `${i + 1}. ${e}`).join('\n')}
（请依剧本此刻情境，给每个背景人物一个符合身份的微反应）`)
  }

  if (project.platformId === 'jimeng') {
    blocks.push(`# 平台特别要求（即梦）
[衔接锁] 请用即梦 @语法：@图片1 引用上一镜尾帧作首帧人物与站位，@图片2 参考背景，@视频1 参考镜头运动；并强调「外貌、服装、光线与 @图片1 完全一致，承接 @图片1 姿态继续动作」。`)
  }

  if (prevShot) {
    blocks.push(`# 上一镜（镜头${prevShot.order}）——用于衔接锁与左右关系承接
剧本：${prevShot.scriptSegment}
${prevShot.aiOutput ? `已生成分镜：\n${prevShot.aiOutput}` : '（上一镜尚未生成分镜，请合理假设其落幅）'}`)
  }

  if (shot.feedback && shot.feedback.trim()) {
    blocks.push(`# 导演对上一版视频效果的反馈（请针对性修正本镜分镜）
${shot.feedback.trim()}`)
  }

  blocks.push(`# 任务
按系统提示词的【统一输出格式】，为「镜头${shot.order}」输出一个镜头块。`)

  return blocks.join('\n\n')
}

// ---------- AI 智能语义拆分（L2）----------

/** 拆分用系统提示词：按语义 + 时长上限把剧本切成分镜 */
export const SYSTEM_SPLIT = `你是短剧分镜导演。把导演给的剧本按「语义完整 + 镜头顺序跟随剧本 + 时长可控」拆成一个个镜头。
规则：
1. 镜头顺序永远跟随剧本原文顺序，不得打乱、不得漏任何台词与剧情。
2. 每个镜头是一个语义完整的最小叙事单元（一个动作节拍 / 一句台词 / 一次情绪转折）。
3. 单个镜头对应的画面时长控制在约 2–4 秒；导演会告诉你单条视频时长上限，你要让相邻镜头能拼进这个上限内。
4. 台词照搬剧本原文，不改写、不翻译。
只输出一个 JSON 数组，每个元素是一个字符串（该镜头对应的剧本原文片段），例如：["明窈将合同往桌上一推。","裴渡缓缓直起身，冷笑。","「你觉得，你有得选？」"]
不要输出任何解释、不要 markdown 代码围栏、不要键名，只要这个 JSON 数组。`

/** 拆分用户消息 */
export function buildSplitUserMessage(scriptText: string, durationLimit: number): string {
  return `单条视频时长上限：${durationLimit}s（请据此控制镜头颗粒度与切镜次数）。
剧本全文如下，请拆分为镜头片段并只输出 JSON 字符串数组：

${scriptText}`
}

/** 从模型回复里稳健地抽出字符串数组 */
export function parseSegments(text: string): string[] {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start < 0 || end < 0 || end <= start) return []
  try {
    const arr = JSON.parse(text.slice(start, end + 1))
    if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean)
  } catch {
    /* fall through */
  }
  return []
}
