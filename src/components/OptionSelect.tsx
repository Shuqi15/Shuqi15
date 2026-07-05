import type { OptionDimension } from '../types'

interface Props {
  dim: OptionDimension
  selected: string[]
  onChange: (ids: string[]) => void
}

/**
 * 单个维度的选择器。支持单选 / 多选（multi）。
 * 每个维度都含 N/A；选中非 N/A 值时自动移除 N/A，反之亦然。
 */
export default function OptionSelect({ dim, selected, onChange }: Props) {
  function toggle(id: string) {
    if (id === 'na') {
      onChange(['na'])
      return
    }
    if (dim.multi) {
      const withoutNa = selected.filter((s) => s !== 'na')
      const next = withoutNa.includes(id)
        ? withoutNa.filter((s) => s !== id)
        : [...withoutNa, id]
      onChange(next.length ? next : ['na'])
    } else {
      onChange([id])
    }
  }

  return (
    <div className="mb-3">
      <div className="mb-1 text-xs font-medium text-gray-400">
        {dim.label}
        {dim.multi && <span className="ml-1 text-[10px] text-gray-500">（可多选）</span>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {dim.values.map((v) => {
          const on = selected.includes(v.id)
          const isNa = v.id === 'na'
          return (
            <button
              key={v.id}
              onClick={() => toggle(v.id)}
              className={[
                'rounded-md px-2.5 py-1 text-xs transition-colors border',
                on
                  ? isNa
                    ? 'bg-edge border-edge text-gray-400'
                    : 'bg-accent/20 border-accent text-accent'
                  : 'bg-panel border-edge text-gray-300 hover:border-gray-500',
              ].join(' ')}
              title={v.ai || '不适用'}
            >
              {v.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
