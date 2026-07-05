import { useState } from 'react'
import type { Project } from '../types'
import { buildFullPrompt } from '../lib/promptBuilder'

interface Props {
  project: Project
}

/** 右栏：整个项目的完整 AI 提示词，可一键复制 */
export default function PromptPanel({ project }: Props) {
  const [copied, setCopied] = useState(false)
  const full = buildFullPrompt(project)

  async function copy() {
    try {
      await navigator.clipboard.writeText(full)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <div className="font-medium text-accent2">AI 提示词（全片）</div>
        <button
          onClick={copy}
          className="rounded-md border border-edge px-2.5 py-1 text-xs text-gray-300 hover:border-accent2 hover:text-accent2"
        >
          {copied ? '已复制 ✓' : '复制全部'}
        </button>
      </div>
      <pre className="flex-1 overflow-y-auto whitespace-pre-wrap px-4 py-3 text-[12px] leading-relaxed text-gray-300">
        {full}
      </pre>
    </div>
  )
}
