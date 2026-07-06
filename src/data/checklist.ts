/** 导演逐镜审核清单（v2 手册 6.4），每项一个勾选框 */
export interface CheckItem {
  id: string
  label: string
}

export const CHECKLIST: CheckItem[] = [
  { id: 'dialogue', label: '台词：与剧本原文一致、未漏未改？（海外剧本用英文原句）' },
  { id: 'link', label: '衔接锁：非首镜写了承接上一镜落幅 + 尾帧图建议？' },
  { id: 'station', label: '站位：四件套齐（九宫格/占比/绑定物/朝向视线）？多人标了左右关系？' },
  { id: 'posture', label: '姿态：没有裸「坐/站」标签，都引用了具体姿态条目？' },
  { id: 'camera', label: '运镜：只有 1 条主运镜？镜头运动与主体运动分两句？' },
  { id: 'light', label: '光线：复述了光线签名块？多人戏写了光源锚定？' },
  { id: 'perform', label: '表演：写的是肌肉+过程，不是情绪标签？挂了防崩坏后缀？' },
  { id: 'extras', label: '配角/群演：每个可见的人都派了活？反应贴合剧情？' },
  { id: 'audit', label: '审计：SCENE AUDIT 列了背景人物 + 不得消失/移位/改人数？' },
  { id: 'duration', label: '切块：本分镜共计 ≤ 14s？镜头顺序跟随剧本？' },
  { id: 'punct', label: '标点：全角「：」「」（）？角色名纯中文无 @？' },
]
