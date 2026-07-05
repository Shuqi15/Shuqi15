import type { Shot } from '../types'
import { DIMENSIONS_BY_GROUP, GROUP_LABEL, GROUP_ORDER } from '../data/options'
import { humanReadable, shotFinalText } from '../lib/promptBuilder'
import OptionSelect from './OptionSelect'

interface Props {
  shot: Shot
  generating: boolean
  hasKey: boolean
  onChange: (patch: Partial<Shot>) => void
  onGenerate: () => void
}

/** 中栏：单个镜头的导演设计区（L1 分组选项 + 口述 + L2 生成 + 反馈） */
export default function ShotEditor({ shot, generating, hasKey, onChange, onGenerate }: Props) {
  function setSelection(dimKey: string, ids: string[]) {
    onChange({ selections: { ...shot.selections, [dimKey]: ids } })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <div className="font-medium text-accent">镜头 {shot.order} 设计（L1）</div>
        <div className="text-xs text-gray-500">时长 {shot.duration}s</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* 对应剧本原文 */}
        <div className="mb-3 rounded-md border border-edge bg-ink/60 p-2">
          <div className="mb-1 text-[11px] text-gray-500">对应剧本原文</div>
          <div className="text-sm text-gray-200">{shot.scriptSegment || '（空）'}</div>
        </div>

        {/* 导演口述 */}
        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            导演口述 / 设计意图 <span className="text-gray-600">（可选填，L2 会理解并落实）</span>
          </label>
          <textarea
            value={shot.directorNote}
            onChange={(e) => onChange({ directorNote: e.target.value })}
            placeholder="先说这段对应哪段剧情、想怎么设计。例如：这里给裴渡一个过肩近景，突出他强忍不屑的冷笑……"
            className="h-16 w-full resize-y rounded-md border border-edge bg-panel p-2 text-sm text-gray-200 outline-none focus:border-accent2"
          />
        </div>

        {/* 绑定物 */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            绑定物 / 空间锚点 <span className="text-gray-600">（可选填）</span>
          </label>
          <input
            value={shot.anchorNote}
            onChange={(e) => onChange({ anchorNote: e.target.value })}
            placeholder="例如：右手死抓红木桌左缘 / 后背贴沙发左扶手"
            className="w-full rounded-md border border-edge bg-panel p-2 text-sm text-gray-200 outline-none focus:border-accent2"
          />
        </div>

        {/* 分组选项 */}
        {GROUP_ORDER.map((g) => (
          <div key={g} className="mb-4">
            <div className="mb-2 border-b border-edge/60 pb-1 text-xs font-semibold uppercase tracking-wide text-accent/80">
              {GROUP_LABEL[g]}
            </div>
            {DIMENSIONS_BY_GROUP[g].map((dim) => (
              <OptionSelect
                key={dim.key}
                dim={dim}
                selected={shot.selections[dim.key] ?? ['na']}
                onChange={(ids) => setSelection(dim.key, ids)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 生成 + 预览 */}
      <div className="border-t border-edge px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={onGenerate}
            disabled={generating || !hasKey}
            className="rounded-md bg-accent2 px-3 py-1.5 text-xs font-semibold text-ink hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            title={hasKey ? 'L2 读剧本+选项，生成统一格式分镜' : '请先在右上角填入 API Key'}
          >
            {generating ? 'L2 生成中…' : '⚡ AI 生成分镜（L2）'}
          </button>
          {!hasKey && <span className="text-[11px] text-gray-500">需先填 API Key</span>}
          {shot.aiOutput && !generating && (
            <span className="text-[11px] text-green-400">已生成 ✓ 可反馈后重生成</span>
          )}
        </div>

        {/* 反馈迭代 */}
        <input
          value={shot.feedback ?? ''}
          onChange={(e) => onChange({ feedback: e.target.value })}
          placeholder="视频效果反馈（重生成时 L2 会针对性修正，例如：情绪太夸张、越轴了、群演动太多）"
          className="mb-2 w-full rounded-md border border-edge bg-panel p-1.5 text-[11px] text-gray-200 outline-none focus:border-accent2"
        />

        <details className="text-xs">
          <summary className="cursor-pointer text-[11px] text-gray-500">导演可读版（分组摘要）</summary>
          <pre className="mt-1 whitespace-pre-wrap text-[11px] text-gray-300">{humanReadable(shot)}</pre>
        </details>
        <div className="mt-2 text-[11px] text-gray-500">
          分镜提示词（{shot.aiOutput ? 'L2 输出' : '本地草稿'}）
        </div>
        <pre className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-md border border-edge bg-ink/60 p-2 text-[11px] text-accent2">
          {shotFinalText(shot)}
        </pre>
      </div>
    </div>
  )
}
