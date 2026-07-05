import type { Shot } from '../types'

interface Props {
  shots: Shot[]
  activeId: string | null
  onSelect: (id: string) => void
  onMergeUp: (id: string) => void
  onSplit: (id: string) => void
  onDelete: (id: string) => void
  onEditSegment: (id: string, text: string) => void
}

/** 左栏：拆分出的镜头列表，可选中/合并/拆分/删除/编辑原文 */
export default function ShotList({
  shots,
  activeId,
  onSelect,
  onMergeUp,
  onSplit,
  onDelete,
  onEditSegment,
}: Props) {
  if (shots.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        还没有镜头。上方输入剧本并点击「拆分分镜」。
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {shots.map((shot, i) => {
        const active = shot.id === activeId
        return (
          <div
            key={shot.id}
            className={[
              'rounded-lg border p-2 transition-colors cursor-pointer',
              active ? 'border-accent bg-accent/10' : 'border-edge bg-panel hover:border-gray-500',
            ].join(' ')}
            onClick={() => onSelect(shot.id)}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-accent">镜头 {shot.order}</span>
              <span
                className={
                  shot.duration === 0
                    ? 'text-[10px] text-red-400'
                    : 'text-[10px] text-gray-500'
                }
              >
                {shot.duration === 0 ? '超时长上限，请合并' : `${shot.duration}s`}
              </span>
            </div>
            <textarea
              value={shot.scriptSegment}
              onChange={(e) => onEditSegment(shot.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full resize-y rounded border border-transparent bg-transparent text-sm text-gray-200 outline-none focus:border-edge focus:bg-ink/60"
            />
            <div className="mt-1 flex gap-2 text-[11px]">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMergeUp(shot.id)
                }}
                disabled={i === 0}
                className="text-gray-400 hover:text-accent2 disabled:opacity-30"
                title="与上一镜合并"
              >
                ⬆ 合并上一镜
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSplit(shot.id)
                }}
                className="text-gray-400 hover:text-accent2"
                title="按标点/换行拆成多镜"
              >
                ✂ 拆分
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(shot.id)
                }}
                className="ml-auto text-gray-400 hover:text-red-400"
              >
                删除
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
