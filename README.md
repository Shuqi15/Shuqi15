# 🎬 分镜导演台（Shot Director）

把**剧本 / 剧情 / 一句话**拆分成分镜，逐镜做导演设计，输出**导演可读版**与**AI 可读的视频提示词**，并适配 LibTV / 剧创 / 灵剧等不同平台。

## 已实现（阶段 1）

- 剧本一键拆分为分镜，每镜标注对应剧本原文
- 三栏工作台：左（分镜列表）· 中（镜头设计）· 右（全片 AI 提示词）
- 分镜可编辑原文、**合并上一镜**、**再拆分**、删除
- 结构化选项库：景别 / 机位 / 运镜 / 灯光 / 情绪 / 群演反应 / 站位 / 节奏，**每项都含 N/A**
- 导演口述框（可选填）
- 时长上限 10s / 15s / 30s，自动按镜数分配每镜时长
- 平台切换，提示词格式随平台变化
- 提示词内含剧本原文剧情，方便导演回溯
- 本地自动保存（localStorage）

## 规划中

- 阶段 2：导演口述框联动、更强的合并/拆分调度与上下文衔接
- 阶段 3：接入 Claude API —— AI 自动语义拆分、自动填选项、把导演口述拆解成选项
- 阶段 4：视频效果反馈迭代机制

## 本地运行

```bash
npm install
npm run dev      # 开发预览
npm run build    # 生产构建
```

## 技术栈

Vite + React + TypeScript + Tailwind CSS，纯前端，数据存本地。

## 目录

```
src/
  types.ts              数据模型
  data/options.ts       选项库（含 N/A）
  data/platforms.ts     平台定义
  lib/splitter.ts       剧本拆分 / 时长分配
  lib/promptBuilder.ts  双版本 & 平台化提示词生成
  lib/storage.ts        本地存储
  components/           三栏 UI 组件
```
