import type { Project, Shot } from '../types'
import { DIMENSIONS } from '../data/options'
import { buildAiPrompt, humanReadable } from '../lib/promptBuilder'
import OptionSelect from './OptionSelect'

interface Props {
  project: Project
  shot: Shot
  onChange: (patch: Partial<Shot>) => void
}

/** 中栏：单个镜头的导演设计区（口述 + 结构化选项 + 双版本预览） */
export default function ShotEditor({ project, shot, onChange }: Props) {
  function setSelection(dimKey: string, ids: string[]) {
    onChange({ selections: { ...shot.selections, [dimKey]: ids } })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <div className="font-medium text-accent">镜头 {shot.order} 设计</div>
        <div className="text-xs text-gray-500">时长 {shot.duration}s</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* 对应剧本原文 */}
        <div className="mb-3 rounded-md border border-edge bg-ink/60 p-2">
          <div className="mb-1 text-[11px] text-gray-500">对应剧本原文</div>
          <div className="text-sm text-gray-200">{shot.scriptSegment || '（空）'}</div>
        </div>

        {/* 导演口述（可选填） */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            导演口述 / 设计意图 <span className="text-gray-600">（可选填）</span>
          </label>
          <textarea
            value={shot.directorNote}
            onChange={(e) => onChange({ directorNote: e.target.value })}
            placeholder="先说说这段你想怎么设计，例如：这里想给一个特写，突出他强忍泪水的苦笑……（阶段 3 可一键拆解为下方选项）"
            className="h-20 w-full resize-y rounded-md border border-edge bg-panel p-2 text-sm text-gray-200 outline-none focus:border-accent2"
          />
        </div>

        {/* 结构化选项 */}
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          镜头要素
        </div>
        {DIMENSIONS.map((dim) => (
          <OptionSelect
            key={dim.key}
            dim={dim}
            selected={shot.selections[dim.key] ?? ['na']}
            onChange={(ids) => setSelection(dim.key, ids)}
          />
        ))}
      </div>

      {/* 双版本预览 */}
      <div className="border-t border-edge px-4 py-3 text-xs">
        <div className="mb-1 text-[11px] text-gray-500">导演可读版</div>
        <div className="mb-3 text-gray-300">{humanReadable(shot)}</div>
        <div className="mb-1 text-[11px] text-gray-500">AI 提示词版（{project.platformId}）</div>
        <pre className="whitespace-pre-wrap rounded-md border border-edge bg-ink/60 p-2 text-[11px] text-accent2">
          {buildAiPrompt(project, shot)}
        </pre>
      </div>
    </div>
  )
}
