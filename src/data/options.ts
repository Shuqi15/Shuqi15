import type { LibGroup, OptionDimension } from '../types'

/** N/A 通用取值：每个维度第一个都放它 */
const NA = { id: 'na', label: 'N/A', ai: '' }

/** 词库分组显示名 */
export const GROUP_LABEL: Record<LibGroup, string> = {
  A: 'A · 站位 / 空间锚定',
  B: 'B · 灯光',
  C: 'C · 表演 / 情绪',
  D: 'D · 动作',
  S: 'S · 运镜 / 其他',
}

/**
 * L1 选项菜单（导演按钮池）。
 * label = 给导演看的中文；ai = L2 拼句用的翻译提示。
 * 完全对应 v2 手册第三部分四大词库 + 小库。
 */
export const DIMENSIONS: OptionDimension[] = [
  // ============ 词库 A · 站位 / 空间锚定 ============
  {
    key: 'grid',
    label: '九宫格位置',
    group: 'A',
    hint: '人物在画面九宫格哪一格',
    values: [
      NA,
      { id: 'tl', label: '左上', ai: '画面左上格 (top-left)' },
      { id: 'tc', label: '中上', ai: '画面中上格 (top-center)' },
      { id: 'tr', label: '右上', ai: '画面右上格 (top-right)' },
      { id: 'ml', label: '左中', ai: '画面左中格 (mid-left)' },
      { id: 'mc', label: '正中', ai: '画面正中格 (center)' },
      { id: 'mr', label: '右中', ai: '画面右中格 (mid-right)' },
      { id: 'bl', label: '左下', ai: '画面左下格 (bottom-left)' },
      { id: 'bc', label: '中下', ai: '画面中下格 (bottom-center)' },
      { id: 'br', label: '右下', ai: '画面右下格 (bottom-right)' },
    ],
  },
  {
    key: 'depth',
    label: '纵深层',
    group: 'A',
    values: [
      NA,
      { id: 'fg', label: '前景(0.5–1m)', ai: '前景，距镜头约0.5–1m (foreground)' },
      { id: 'mg', label: '中景(1.5–3m)', ai: '中景，距镜头约1.5–3m (midground)' },
      { id: 'bg', label: '后景(3m+)', ai: '后景，距镜头约3m以上 (background)' },
    ],
  },
  {
    key: 'ratio',
    label: '画面占比',
    group: 'A',
    hint: '人物占画面多大',
    values: [
      NA,
      { id: 'fill', label: '占满(特写)', ai: '占满画面 (fills frame, close-up)' },
      { id: 'half', label: '约½(半身)', ai: '半身约占画面½ (~half frame)' },
      { id: 'third', label: '约⅓(全身立)', ai: '全身约占画面⅓ (~one third, full body)' },
      { id: 'fifth', label: '约⅕(全景小)', ai: '约占画面⅕ (~one fifth, small in wide)' },
      { id: 'silh', label: '剪影点缀', ai: '剪影点缀，极小 (tiny silhouette)' },
    ],
  },
  {
    key: 'facing',
    label: '银幕朝向',
    group: 'A',
    values: [
      NA,
      { id: 'sl', label: '面向画左', ai: '面向画面左侧 (face screen-left)' },
      { id: 'sr', label: '面向画右', ai: '面向画面右侧 (face screen-right)' },
      { id: 'cam', label: '面向镜头', ai: '面向镜头 (face camera)' },
      { id: 'away', label: '背对镜头', ai: '背对镜头 (back to camera)' },
      { id: 'q34l', label: '¾侧(左)', ai: '四分之三侧对镜头、偏左 (three-quarter, left)' },
      { id: 'q34r', label: '¾侧(右)', ai: '四分之三侧对镜头、偏右 (three-quarter, right)' },
    ],
  },
  {
    key: 'eyeline',
    label: '视线落点',
    group: 'A',
    values: [
      NA,
      { id: 'onchar', label: '看向对手角色', ai: '目光落在对手角色身上 (eyeline on the other character)' },
      { id: 'tocam', label: '看向镜头', ai: '直视镜头 (eyeline to camera)' },
      { id: 'onprop', label: '看向道具', ai: '目光落在关键道具上 (eyeline on prop)' },
      { id: 'blank', label: '目光放空', ai: '目光放空、失焦 (unfocused gaze)' },
      { id: 'down', label: '俯视', ai: '俯视 (looking down)' },
      { id: 'up', label: '仰视', ai: '仰视 (looking up)' },
    ],
  },
  {
    key: 'posture',
    label: '姿态（禁裸标签，引用姿态库）',
    group: 'A',
    hint: '不能只写坐/站，必须引用具体姿态条目',
    values: [
      NA,
      { id: 'sit_upright', label: '端正坐', ai: '端正坐：臀落椅面2/3、腰背挺直、双手放大腿、上身正直' },
      { id: 'sit_relax', label: '放松靠坐', ai: '放松靠坐：后背贴椅背、双腿自然分开、臂搭扶手' },
      { id: 'sit_lean', label: '前倾坐·肘撑膝', ai: '前倾坐：坐椅前沿、上身前倾15°、肘撑膝、双手松握' },
      { id: 'sit_cross', label: '跷腿坐', ai: '跷腿坐：右踝搭左膝、上身微后仰、右手搭踝' },
      { id: 'sit_curl', label: '蜷坐', ai: '蜷坐：屈膝抱腿、下巴抵膝、身体缩小' },
      { id: 'sit_bed', label: '侧坐床沿', ai: '侧坐床沿：斜坐床沿、单手撑床、另一手垂膝' },
      { id: 'stand_nat', label: '自然站', ai: '自然站：双脚与肩同宽、重心均分、双臂自然垂' },
      { id: 'stand_hip', label: '重心偏侧', ai: '重心偏侧：重心70%在左腿、右膝微弯、胯向左顶' },
      { id: 'stand_cross', label: '抱胸站', ai: '抱胸站：双臂抱胸、重心微后、下巴微收' },
      { id: 'stand_wall', label: '靠墙', ai: '靠墙：肩胛贴墙、重心80%在墙、一脚踝交叠' },
      { id: 'stand_akimbo', label: '叉腰站', ai: '叉腰站：双手叉腰、双脚略宽、上身微前压' },
      { id: 'stand_def', label: '防御站姿', ai: '防御站姿：双脚宽于肩、膝微弯、重心下压5cm、臂微抬' },
      { id: 'lie_supine', label: '平躺', ai: '平躺：后背贴床垫、双臂置身侧、头陷枕' },
      { id: 'lie_side', label: '侧卧', ai: '侧卧：侧身屈腿、一手枕头下、面朝画面' },
      { id: 'kneel', label: '单膝跪', ai: '单膝跪：一膝触地、一手撑地、上身前倾' },
      { id: 'crouch', label: '蹲身', ai: '蹲身：屈膝下蹲、臀不触地、双臂环膝' },
    ],
  },

  // ============ 词库 B · 灯光 ============
  {
    key: 'lightSource',
    label: '光源类型',
    group: 'B',
    values: [
      NA,
      { id: 'natural', label: '自然光', ai: '自然光 (natural light)' },
      { id: 'artificial', label: '人工光', ai: '人工光 (artificial light)' },
      { id: 'mixed', label: '混合光', ai: '混合光 (mixed light)' },
      { id: 'practical', label: '实用动机光源', ai: '实用动机光源 (practical motivated light)' },
    ],
  },
  {
    key: 'lightTime',
    label: '自然光·时间',
    group: 'B',
    values: [
      NA,
      { id: 'dawn', label: '清晨', ai: '清晨柔光 (dawn)' },
      { id: 'morning', label: '上午', ai: '上午光 (morning)' },
      { id: 'noon', label: '正午', ai: '正午硬光 (noon)' },
      { id: 'afternoon', label: '午后', ai: '午后光 (afternoon)' },
      { id: 'golden', label: '黄金时刻', ai: '黄金时刻暖光 (golden hour)' },
      { id: 'blue', label: '蓝调时刻', ai: '蓝调时刻冷光 (blue hour)' },
      { id: 'overcast', label: '阴天', ai: '阴天漫射光 (overcast)' },
      { id: 'rainy', label: '雨天', ai: '雨天低沉光 (rainy)' },
      { id: 'moonlit', label: '月夜', ai: '月夜冷光 (moonlit)' },
    ],
  },
  {
    key: 'lightArtificial',
    label: '人工/实用光',
    group: 'B',
    values: [
      NA,
      { id: 'fluorescent', label: '荧光顶灯', ai: '荧光顶灯 (fluorescent)' },
      { id: 'tungsten', label: '白炽暖灯', ai: '白炽暖灯 (tungsten)' },
      { id: 'spotlight', label: '聚光灯', ai: '聚光灯 (spotlight)' },
      { id: 'desklamp', label: '台灯', ai: '台灯 (desk lamp)' },
      { id: 'candle', label: '烛光', ai: '烛光 (candle)' },
      { id: 'fireplace', label: '壁炉', ai: '壁炉火光 (fireplace)' },
      { id: 'neon', label: '霓虹', ai: '霓虹 (neon)' },
      { id: 'screen', label: '屏幕光', ai: '屏幕冷光 (screen glow)' },
      { id: 'headlights', label: '车灯', ai: '车灯 (headlights)' },
      { id: 'flashlight', label: '手电', ai: '手电 (flashlight)' },
    ],
  },
  {
    key: 'lightDir',
    label: '方向',
    group: 'B',
    values: [
      NA,
      { id: 'front', label: '顺光', ai: '顺光 (front light)' },
      { id: 'side', label: '侧光', ai: '侧光 (side light)' },
      { id: 'sideback', label: '侧逆光', ai: '侧逆光 (side-back light)' },
      { id: 'back', label: '逆光', ai: '逆光 (back light)' },
      { id: 'top', label: '顶光', ai: '顶光 (top light)' },
      { id: 'bottom', label: '底光', ai: '底光 (bottom light)' },
      { id: 'rim', label: '边缘光', ai: '边缘光 (rim light)' },
    ],
  },
  {
    key: 'lightAngle',
    label: '角度',
    group: 'B',
    values: [
      NA,
      { id: 'high45', label: '高位45°', ai: '高位45° (high 45°)' },
      { id: 'eye', label: '水平齐眼', ai: '水平齐眼 (eye-level)' },
      { id: 'lowup', label: '低位仰射', ai: '低位仰射 (low up-cast)' },
      { id: 'overhead', label: '头顶垂直', ai: '头顶垂直 (overhead vertical)' },
    ],
  },
  {
    key: 'lightSoft',
    label: '软硬',
    group: 'B',
    values: [
      NA,
      { id: 'hard', label: '硬光', ai: '硬光、清晰硬影 (hard light)' },
      { id: 'medium', label: '中等', ai: '中等软硬 (medium)' },
      { id: 'soft', label: '柔光', ai: '柔光、漫射无硬影 (soft light)' },
    ],
  },
  {
    key: 'lightColor',
    label: '色温色调',
    group: 'B',
    values: [
      NA,
      { id: 'warm', label: '暖(3200K)', ai: '暖橙金3200K (warm)' },
      { id: 'neutral', label: '中性(4500K)', ai: '中性4500K (neutral)' },
      { id: 'cool', label: '冷(5600K)', ai: '冷蓝5600K (cool)' },
      { id: 'tealorange', label: '青橙对比', ai: '青橙对比 (teal-orange)' },
      { id: 'desat', label: '去饱和', ai: '去饱和 (desaturated)' },
    ],
  },
  {
    key: 'lightContrast',
    label: '对比+介质',
    group: 'B',
    values: [
      NA,
      { id: 'hi', label: '高对比', ai: '高对比 (high contrast)' },
      { id: 'mid', label: '中对比', ai: '中对比 (mid contrast)' },
      { id: 'low', label: '低平', ai: '低平对比 (low contrast)' },
      { id: 'haze', label: '薄雾', ai: '薄雾介质 (haze)' },
      { id: 'dust', label: '浮尘', ai: '浮尘、可见丁达尔 (dust god-rays)' },
      { id: 'mist', label: '水汽', ai: '水汽 (mist)' },
      { id: 'clean', label: '干净通透', ai: '干净通透 (clean)' },
    ],
  },
  {
    key: 'lightShape',
    label: '光影形态',
    group: 'B',
    multi: true,
    values: [
      NA,
      { id: 'longshadow', label: '长阴影', ai: '长阴影 (long shadow)' },
      { id: 'split', label: '半脸split', ai: '半脸split (split face)' },
      { id: 'catchlight', label: '眼神光', ai: '眼神光 (catchlight)' },
      { id: 'goldrim', label: '发肩金边', ai: '发肩金边 (gold rim on hair/shoulders)' },
      { id: 'godray', label: '丁达尔光束', ai: '丁达尔光束 (god-rays)' },
      { id: 'dappled', label: '斑驳树影', ai: '斑驳树影 (dappled shade)' },
      { id: 'window', label: '窗棂投影', ai: '窗棂投影 (window-grid shadow)' },
      { id: 'flat', label: '无阴影平光', ai: '无阴影平光 (shadowless)' },
      { id: 'deepeye', label: '深陷眼窝', ai: '深陷眼窝 (deep eye sockets)' },
      { id: 'hardedge', label: '硬边界光', ai: '硬边界光 (hard-edge)' },
    ],
  },
  {
    key: 'lightPreset',
    label: '质感速配（一键预设）',
    group: 'B',
    hint: '选后 L2 展开为整套光线签名块',
    values: [
      NA,
      { id: 'noir', label: '悬疑夜戏', ai: '人工·聚光/霓虹+侧逆光+硬光+冷5600K+高对比+深陷眼窝' },
      { id: 'warmth', label: '温情回忆', ai: '自然·黄金时刻+侧光+柔光+暖3200K+低对比+发肩金边' },
      { id: 'product', label: '商业产品', ai: '人工·LED面板+顺光+柔光+中性+低平+无阴影' },
      { id: 'interro', label: '审讯对峙', ai: '人工·顶部聚光+顶光+硬光+冷+高对比+半脸split' },
      { id: 'doc', label: '纪实手持', ai: '自然·阴天+漫射+柔光+去饱和+低对比+无硬影' },
      { id: 'candlelit', label: '古装烛光', ai: '实用·烛光/壁炉+底光+柔光+暖+中对比+不稳跳动柔影' },
    ],
  },

  // ============ 词库 C · 表演 / 情绪 ============
  {
    key: 'emotion',
    label: '情绪（8家族→肌肉翻译）',
    group: 'C',
    hint: 'L2 会翻成肌肉动作+过程时间线，绝不下发标签',
    values: [
      NA,
      // 喜
      { id: 'joy_faint', label: '喜·若有似无的笑', ai: '嘴角极轻微上勾、几乎不可察，眼部无弯度，面部完全放松，似笑非笑' },
      { id: 'joy_soft', label: '喜·浅笑', ai: '嘴角柔和上扬，下眼睑轻抬、眼尾极浅弯，白里透红' },
      { id: 'joy_tender', label: '喜·温柔笑', ai: '嘴角缓上扬、眉眼同步弯，眼神柔和有暖意，肩微松' },
      { id: 'joy_happy', label: '喜·开心笑', ai: '嘴角明显上扬露齿，苹果肌抬起，眼尾自然起皱（真笑达眼底）' },
      { id: 'joy_smug', label: '喜·得意', ai: '闭口满足笑、单侧偏高，同侧眉挑2mm，眼尾起皱，头微后仰，胸微挺' },
      { id: 'joy_shy', label: '喜·娇羞甜笑', ai: '抿唇轻笑、嘴角内收，视线短暂垂下又抬，耳廓边缘自然透微红' },
      // 怒
      { id: 'ang_hold', label: '怒·隐忍怒', ai: '下颌线绷紧、喉结微动，呼吸变浅，视线固定，无大动作' },
      { id: 'ang_cold', label: '怒·冷怒', ai: '眉压低、眼神冷硬直视，鼻翼极轻张，唇线抿平' },
      { id: 'ang_smirk', label: '怒·冷笑', ai: '单侧嘴角勾起、弧度冰冷，同侧鼻翼微张，眼神眯起下瞥，下巴微抬' },
      { id: 'ang_scoff', label: '怒·嗤笑(嘲讽)', ai: '鼻腔轻哼同时嘴角向一侧撇，眼神斜睨，嘴角幅度极小' },
      { id: 'ang_rage', label: '怒·暴怒', ai: '眉紧锁下压、双眼圆睁但不外凸，颈侧青筋微显，下颌前突（不移位夸张）' },
      // 哀
      { id: 'sad_wronged', label: '哀·委屈', ai: '下唇微努，眉心内聚上抬、眉尾下压，眼眶微湿，下巴几不可察地颤' },
      { id: 'sad_hold', label: '哀·强忍泪', ai: '眼眶盈泪不落，下眼睑绷紧、频繁眨眼压回，喉头一紧，吸气' },
      { id: 'sad_tear', label: '哀·默默流泪', ai: '面部近乎不动，一行泪自眼角滑落，目光失焦，唇微抿' },
      { id: 'sad_break', label: '哀·崩溃大哭', ai: '眉全力内聚上挑，嘴角大幅下拉、口略张，脸颊肌抽动，肩起伏（不崩脸）' },
      { id: 'sad_heart', label: '哀·心碎', ai: '表情先僵后塌，眼神一寸寸黯下去，嘴唇无声张合' },
      { id: 'sad_despair', label: '哀·绝望的平静', ai: '面部松弛无表情，眼神空茫，呼吸极缓，偶尔极慢眨眼' },
      { id: 'sad_bitter', label: '哀·苦笑', ai: '[0-1s]面部平静→[1-2.5s]单侧嘴角短暂上扬起苦笑、眉心微聚→[2.5-4s]嘴角回落下压、视线下移、轻呼一口气' },
      // 惧
      { id: 'fear_uneasy', label: '惧·紧张不安', ai: '指尖反复搓衣角，眼神频繁躲闪，身体微僵，吞咽' },
      { id: 'fear_guilty', label: '惧·心虚', ai: '快速瞥向别处、吞咽，肩微缩，避开对视' },
      { id: 'fear_terror', label: '惧·惊恐', ai: '瞳孔骤缩、眼睁大，身体后仰半步，呼吸急促（不夸张变形）' },
      { id: 'fear_freeze', label: '惧·僵住', ai: '全身瞬间静止，肌肉绷紧，呼吸屏住' },
      // 惊
      { id: 'sur_mild', label: '惊·吃惊(不夸张)', ai: '美眸微睁、瞳孔骤缩，眉微抬不移位，身体瞬间静止半秒' },
      { id: 'sur_shock', label: '惊·震惊', ai: '呼吸一滞，嘴唇微张，视线钉住对方，半秒无反应后瞳孔微颤' },
      { id: 'sur_daze', label: '惊·呆滞', ai: '目光失焦定住，五官松弛不动，反应延迟' },
      // 恶
      { id: 'dis_disgust', label: '恶·厌恶', ai: '上唇单侧微提、鼻梁皱起极浅，头微偏离，眼神下移' },
      { id: 'dis_scorn', label: '恶·鄙夷', ai: '下巴微抬俯视，单眉挑，嘴角向下压，眼神扫过即移开' },
      { id: 'dis_cold', label: '恶·冷漠疏离', ai: '五官松弛无起伏，眼神平直不聚焦对方，微微侧身拉距' },
      // 平静
      { id: 'calm_blank', label: '平静·面无表情', ai: '五官完全放松、无动作，眼神平直，仅自然眨眼' },
      { id: 'calm_think', label: '平静·沉思', ai: '视线聚焦中景虚点，眉微收，手指无意识轻触下唇/下巴' },
      { id: 'calm_tired', label: '平静·疲惫', ai: '眼睑微沉、眼神散，肩下塌，呼气长' },
      // 复合
      { id: 'cx_awkward', label: '复合·尬笑', ai: '嘴角快速扯动一下即收，视线躲向左下，右手无意识摸后颈，肩微耸' },
      { id: 'cx_hesitate', label: '复合·欲言又止', ai: '嘴唇张开又抿回，喉头微动，眉轻挑又落，视线游移' },
      { id: 'cx_flutter', label: '复合·心动怦然', ai: '呼吸一顿，瞳孔微亮放大，嘴角不自觉轻扬，耳廓透微红，视线黏住又慌忙移开' },
      { id: 'cx_ambig', label: '复合·暧昧似笑非笑', ai: '嘴角0.5mm暧昧弧度，眼神稳定不可读，全脸肌肉几乎不动' },
      { id: 'cx_cry2smile', label: '复合·破涕为笑', ai: '泪痕未干、下眼睑仍湿，嘴角却先颤后扬，眉心由紧转松' },
    ],
  },
  {
    key: 'intensity',
    label: '情绪强度',
    group: 'C',
    values: [
      NA,
      { id: 'micro', label: '微（内敛微表情）', ai: '强度：微，仅微表情、内敛' },
      { id: 'mid', label: '中（常态）', ai: '强度：中，常态外露' },
      { id: 'strong', label: '强（外露不崩坏）', ai: '强度：强、外露，但严守防崩坏' },
    ],
  },

  // ============ 词库 D · 动作（五轴 DALSF + 动作类）============
  {
    key: 'actBody',
    label: 'D 部位',
    group: 'D',
    values: [
      NA,
      { id: 'hand', label: '左/右手', ai: '手' },
      { id: 'arm', label: '前臂', ai: '前臂' },
      { id: 'head', label: '头', ai: '头' },
      { id: 'neck', label: '颈', ai: '颈' },
      { id: 'shoulder', label: '肩', ai: '肩' },
      { id: 'torso', label: '上身', ai: '上身' },
      { id: 'hip', label: '腰胯', ai: '腰胯' },
      { id: 'leg', label: '左/右腿', ai: '腿' },
      { id: 'whole', label: '全身', ai: '全身' },
      { id: 'weight', label: '重心', ai: '重心' },
    ],
  },
  {
    key: 'actAmp',
    label: 'A 幅度',
    group: 'D',
    values: [
      NA,
      { id: 'a5', label: '微幅5°', ai: '微幅约5° (barely)' },
      { id: 'a15', label: '小幅15°', ai: '小幅约15° (subtle)' },
      { id: 'a45', label: '中幅45°', ai: '中幅约45° (moderate)' },
      { id: 'a90', label: '大幅90°', ai: '大幅约90° (full)' },
      { id: 'a180', label: '极限180°', ai: '极限约180° (extreme)' },
    ],
  },
  {
    key: 'actPath',
    label: 'L 轨迹',
    group: 'D',
    values: [
      NA,
      { id: 'linear', label: '直线', ai: '直线 (linear)' },
      { id: 'arc', label: '弧线', ai: '弧线 (arc)' },
      { id: 'scurve', label: 'S形', ai: 'S形 (s-curve)' },
      { id: 'diag', label: '对角', ai: '对角 (diagonal)' },
      { id: 'staccato', label: '断续', ai: '断续 (staccato)' },
      { id: 'recoil', label: '回弹', ai: '回弹 (recoil)' },
      { id: 'spiral', label: '螺旋', ai: '螺旋 (spiral)' },
    ],
  },
  {
    key: 'actSpeed',
    label: 'S 速度',
    group: 'D',
    values: [
      NA,
      { id: 'glacial', label: '极慢', ai: '极慢 (glacial)' },
      { id: 'slow', label: '缓慢', ai: '缓慢 (slow)' },
      { id: 'deliberate', label: '从容', ai: '从容 (deliberate)' },
      { id: 'natural', label: '正常', ai: '正常 (natural)' },
      { id: 'brisk', label: '轻快', ai: '轻快 (brisk)' },
      { id: 'fast', label: '快速', ai: '快速 (fast)' },
      { id: 'explosive', label: '爆发', ai: '爆发、突然发力 (explosive)' },
    ],
  },
  {
    key: 'actForce',
    label: 'F 力度收尾',
    group: 'D',
    values: [
      NA,
      { id: 'gentle', label: '轻柔', ai: '力度轻柔 (gentle)' },
      { id: 'restrained', label: '克制', ai: '力度克制 (restrained)' },
      { id: 'forceful', label: '用力', ai: '力度用力 (forceful)' },
      { id: 'settle', label: '收尾·定住', ai: '收尾定住 (settle)' },
      { id: 'drop', label: '收尾·回落', ai: '收尾回落 (drop)' },
      { id: 'carry', label: '收尾·带余势', ai: '收尾带余势 (carry)' },
      { id: 'rebound', label: '收尾·回弹', ai: '收尾回弹 (rebound)' },
    ],
  },
  {
    key: 'action',
    label: '动作（8大类）',
    group: 'D',
    hint: '单镜核心动作 ≤ 2；大爆发只在本镜唯一重点时用',
    values: [
      NA,
      // 手/上肢
      { id: 'reach_hes', label: '手·伸手(迟疑)', ai: '右臂从身侧缓抬至胸前，肘微弯掌心张开，中途停住，迟疑速度' },
      { id: 'shield', label: '手·举手挡', ai: '右手急抬至面前、掌心朝外护住，肘弯，小幅快速' },
      { id: 'point', label: '手·指向', ai: '食指伸向目标、余指收拢，臂半伸肘130°，指尖对准' },
      { id: 'fist', label: '手·握拳', ai: '手指从张开收成紧拳，指节微白，前臂绷紧，缓起用力' },
      { id: 'coverlips', label: '手·掩口', ai: '指尖轻抵唇边，动作轻，肩微抬' },
      { id: 'tuckhair', label: '手·理鬓发', ai: '指腹从耳侧向后轻拢碎发，头微侧，从容' },
      // 头/颈
      { id: 'nod', label: '头·点头', ai: '下巴小幅上下点动，随语气' },
      { id: 'shake', label: '头·摇头', ai: '头左右小幅摆动否定' },
      { id: 'turnback', label: '头·回头', ai: '身体不动仅头转45°越左肩，眼在下巴转完前先找到对方' },
      { id: 'tilt', label: '头·歪头疑惑', ai: '头微倾一侧，眉微挑，疑问感' },
      // 躯干/转身
      { id: 'turn180', label: '身·180°转身', ai: '逆时针从面向镜头转到面向门，胯先动、头略延迟，2s从容' },
      { id: 'leanin', label: '身·前倾', ai: '上身向对方微前倾压近，重心移前' },
      { id: 'recline', label: '身·后仰', ai: '上身微后仰拉开距离' },
      { id: 'slump', label: '身·瘫软', ai: '双腿一软顺墙/椅滑坐落地，肩塌头垂，力气抽空' },
      // 下肢/步伐
      { id: 'stepfwd', label: '腿·上前一步', ai: '右脚向前跨一步，上身微前倾压近，重心移前脚' },
      { id: 'stepback', label: '腿·后退避让', ai: '右脚小步后撤，上身仍面向对方，谨慎防御' },
      { id: 'pace', label: '腿·踱步', ai: '缓慢来回踱步，重心平稳移动' },
      // 起落
      { id: 'rise', label: '起落·起身', ai: '双手撑物、缓缓直起身，重心上移' },
      { id: 'sitdown', label: '起落·坐下', ai: '缓缓屈膝坐下，臀落椅面' },
      { id: 'collapse', label: '起落·瘫坐', ai: '双腿一软顺墙/椅滑坐落地，肩塌头垂' },
      // 道具交互
      { id: 'pickup', label: '道具·拿起', ai: '手握物缓抬，手腕稳' },
      { id: 'pushdoc', label: '道具·推(合同)', ai: '手指将桌面文件往对方一推，直线滑出' },
      { id: 'drop', label: '道具·松手脱落', ai: '手指松开，物体受重力垂直直落（不横飘）' },
      { id: 'raiseglass', label: '道具·举杯', ai: '手握杯身缓抬至胸前，手腕稳，杯口不倾' },
      { id: 'drawsword', label: '道具·拔剑', ai: '左手稳住剑鞘，右手缓拔半出，金属感显露，剑尖朝下' },
      { id: 'turnpage', label: '道具·翻页', ai: '拇指与食指捏页角，手腕轻挑翻过，视线随之' },
      { id: 'pushdoor', label: '道具·推门', ai: '手掌按门面(腰高)，臂前伸，门沿铰链弧线开90°，身随之入框' },
      // 人际交互
      { id: 'hug', label: '人·拥抱', ai: '双臂环抱对方，上身贴近' },
      { id: 'pushaway', label: '人·推开', ai: '双手抵对方肩/胸，肘由弯到直发力，对方后退半步' },
      { id: 'grabcollar', label: '人·揪领口', ai: '手快速抓住对方衣领、攥紧下拉，臂绷紧，对方前倾' },
      { id: 'support', label: '人·搀扶', ai: '一手托对方肘、一手扶背，重心侧移承力，缓' },
      { id: 'caress', label: '人·抚脸', ai: '指背/掌心轻贴对方脸颊，动作极缓极轻，指尖微顿' },
      // 眼神/头部微控
      { id: 'lookover', label: '眼·上下打量', ai: '目光自对方脸缓移到脚再回，头微不动，评估感' },
      { id: 'glance', label: '眼·瞟一眼', ai: '眼球快速侧移瞥向目标、随即收回，头不动' },
      { id: 'openeyes', label: '眼·缓睁眼', ai: '眼睑缓缓抬起、睫毛先颤，聚焦由虚到实' },
      { id: 'blinktear', label: '眼·眨眼压泪', ai: '频繁眨眼将盈眶泪压回' },
    ],
  },

  // ============ 小库 · 运镜 / 其他 ============
  {
    key: 'camera',
    label: '运镜（一镜1主）',
    group: 'S',
    hint: '常规对话只用对切固定/过肩；情绪炸点/出场/转场才上强运镜',
    values: [
      NA,
      { id: 'static', label: '固定', ai: '固定机位 (static)' },
      { id: 'push', label: '推', ai: '缓推 (slow push-in)' },
      { id: 'pull', label: '拉', ai: '拉镜 (pull-out)' },
      { id: 'pan', label: '摇', ai: '横摇 (pan)' },
      { id: 'move', label: '移', ai: '平移 (dolly move)' },
      { id: 'follow', label: '跟', ai: '跟拍 (tracking)' },
      { id: 'orbit', label: '环绕(高光反转)', ai: '环绕运镜 (orbit)' },
      { id: 'crane', label: '升降', ai: '升降 (crane)' },
      { id: 'whip', label: '甩镜(凌厉转场)', ai: '甩镜 (whip pan)' },
      { id: 'impact', label: '冲击镜', ai: '极速推拉冲击镜 (impact zoom)' },
      { id: 'dolly_zoom', label: '希区柯克变焦', ai: '希区柯克变焦 (dolly zoom)' },
      { id: 'handheld', label: '手持颠簸', ai: '手持颠簸 (handheld)' },
      { id: 'oneshot', label: '一镜到底', ai: '一镜到底 (long take)' },
    ],
  },
  {
    key: 'angle',
    label: '机位视角',
    group: 'S',
    values: [
      NA,
      { id: 'eye', label: '平视', ai: '平视 (eye-level)' },
      { id: 'high', label: '俯拍(弱势)', ai: '俯拍 (high angle)' },
      { id: 'low', label: '仰拍(压迫)', ai: '仰拍 (low angle)' },
      { id: 'ots', label: '过肩(对话常用)', ai: '过肩 (over-the-shoulder)' },
      { id: 'pov', label: 'POV', ai: '主观视角 (POV)' },
      { id: 'macro', label: '微距', ai: '微距 (macro)' },
    ],
  },
  {
    key: 'shotSize',
    label: '景别',
    group: 'S',
    values: [
      NA,
      { id: 'ecu', label: '大特写', ai: '大特写 (extreme close-up)' },
      { id: 'cu', label: '特写', ai: '特写 (close-up)' },
      { id: 'mcu', label: '近景', ai: '近景 (medium close-up)' },
      { id: 'ms', label: '中景', ai: '中景 (medium shot)' },
      { id: 'fs', label: '全景', ai: '全景 (full shot)' },
      { id: 'ws', label: '远景', ai: '远景 (wide shot)' },
    ],
  },
]

export const DIMENSION_BY_KEY: Record<string, OptionDimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
)

/** 按分组归类维度（供 UI 分区渲染） */
export const DIMENSIONS_BY_GROUP: Record<LibGroup, OptionDimension[]> = {
  A: DIMENSIONS.filter((d) => d.group === 'A'),
  B: DIMENSIONS.filter((d) => d.group === 'B'),
  C: DIMENSIONS.filter((d) => d.group === 'C'),
  D: DIMENSIONS.filter((d) => d.group === 'D'),
  S: DIMENSIONS.filter((d) => d.group === 'S'),
}

export const GROUP_ORDER: LibGroup[] = ['A', 'B', 'C', 'D', 'S']

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
