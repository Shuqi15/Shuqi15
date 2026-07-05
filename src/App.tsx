import { useEffect, useMemo, useState } from 'react'
import type { DurationLimit, Project, Shot } from './types'
import { PLATFORMS } from './data/platforms'
import { defaultSelections } from './data/options'
import { buildShots, renumberAndReallocate, splitScript } from './lib/splitter'
import { loadProject, saveProject } from './lib/storage'
import { uid } from './lib/id'
import ShotList from './components/ShotList'
import ShotEditor from './components/ShotEditor'
import PromptPanel from './components/PromptPanel'

const DURATIONS: DurationLimit[] = [10, 15, 30]

function newProject(): Project {
  return {
    id: uid('proj'),
    title: '未命名项目',
    scriptText: '',
    platformId: 'libtv',
    durationLimit: 15,
    shots: [],
    updatedAt: Date.now(),
  }
}

export default function App() {
  const [project, setProject] = useState<Project>(() => loadProject() ?? newProject())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scriptDraft, setScriptDraft] = useState(project.scriptText)

  // 变更即存本地
  useEffect(() => {
    saveProject({ ...project, updatedAt: Date.now() })
  }, [project])

  const activeShot = useMemo(
    () => project.shots.find((s) => s.id === activeId) ?? null,
    [project.shots, activeId],
  )

  function update(patch: Partial<Project>) {
    setProject((p) => ({ ...p, ...patch }))
  }

  function setShots(next: Shot[]) {
    update({ shots: renumberAndReallocate(next, project.durationLimit) })
  }

  // ---------- 剧本拆分 ----------
  function doSplit() {
    const shots = buildShots(scriptDraft, project.durationLimit)
    setProject((p) => ({ ...p, scriptText: scriptDraft, shots }))
    setActiveId(shots[0]?.id ?? null)
  }

  // ---------- 镜头操作 ----------
  function patchShot(id: string, patch: Partial<Shot>) {
    setProject((p) => ({
      ...p,
      shots: p.shots.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  function mergeUp(id: string) {
    const idx = project.shots.findIndex((s) => s.id === id)
    if (idx <= 0) return
    const prev = project.shots[idx - 1]
    const cur = project.shots[idx]
    const merged: Shot = {
      ...prev,
      // 合并原文并衔接上下文
      scriptSegment: `${prev.scriptSegment} ${cur.scriptSegment}`.trim(),
      directorNote: [prev.directorNote, cur.directorNote].filter(Boolean).join('；'),
    }
    const next = [...project.shots.slice(0, idx - 1), merged, ...project.shots.slice(idx + 1)]
    setShots(next)
    setActiveId(merged.id)
  }

  function splitShot(id: string) {
    const idx = project.shots.findIndex((s) => s.id === id)
    if (idx < 0) return
    const cur = project.shots[idx]
    const parts = splitScript(cur.scriptSegment)
    if (parts.length <= 1) return
    const newShots: Shot[] = parts.map((seg, i) => ({
      id: i === 0 ? cur.id : uid('shot'),
      order: 0,
      scriptSegment: seg,
      // 第一段保留原设计，其余段重置为 N/A
      directorNote: i === 0 ? cur.directorNote : '',
      selections: i === 0 ? cur.selections : defaultSelections(),
      duration: 0,
    }))
    const next = [...project.shots.slice(0, idx), ...newShots, ...project.shots.slice(idx + 1)]
    setShots(next)
  }

  function deleteShot(id: string) {
    const next = project.shots.filter((s) => s.id !== id)
    setShots(next)
    if (activeId === id) setActiveId(next[0]?.id ?? null)
  }

  function changeDuration(limit: DurationLimit) {
    setProject((p) => ({
      ...p,
      durationLimit: limit,
      shots: renumberAndReallocate(p.shots, limit),
    }))
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 顶栏 */}
      <header className="flex flex-wrap items-center gap-3 border-b border-edge bg-panel px-4 py-2.5">
        <div className="text-sm font-bold tracking-wide text-accent">🎬 分镜导演台</div>
        <input
          value={project.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-40 rounded border border-edge bg-ink px-2 py-1 text-sm text-gray-200 outline-none focus:border-accent"
        />
        <div className="ml-auto flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1">
            <span className="text-gray-400">平台</span>
            <select
              value={project.platformId}
              onChange={(e) => update({ platformId: e.target.value })}
              className="rounded border border-edge bg-ink px-2 py-1 text-gray-200 outline-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span className="text-gray-400">时长上限</span>
            <div className="flex overflow-hidden rounded border border-edge">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => changeDuration(d)}
                  className={[
                    'px-2 py-1',
                    project.durationLimit === d
                      ? 'bg-accent text-ink'
                      : 'bg-ink text-gray-300 hover:bg-edge',
                  ].join(' ')}
                >
                  {d}s
                </button>
              ))}
            </div>
          </label>
        </div>
      </header>

      {/* 剧本输入条 */}
      <div className="flex items-start gap-2 border-b border-edge bg-ink px-4 py-2.5">
        <textarea
          value={scriptDraft}
          onChange={(e) => setScriptDraft(e.target.value)}
          placeholder="在此粘贴剧本 / 剧情 / 一句话，例如：他推开门，看见空荡的房间。她早已离开。桌上留着一张字条……"
          className="h-16 flex-1 resize-y rounded-md border border-edge bg-panel p-2 text-sm text-gray-200 outline-none focus:border-accent"
        />
        <button
          onClick={doSplit}
          className="h-16 shrink-0 rounded-md bg-accent px-4 text-sm font-semibold text-ink hover:brightness-110"
        >
          拆分分镜 →
        </button>
      </div>

      {/* 三栏主体 */}
      <main className="grid min-h-0 flex-1 grid-cols-[300px_1fr_360px]">
        <section className="min-h-0 overflow-y-auto border-r border-edge">
          <div className="border-b border-edge px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            分镜列表（可编辑 / 合并 / 拆分）
          </div>
          <ShotList
            shots={project.shots}
            activeId={activeId}
            onSelect={setActiveId}
            onMergeUp={mergeUp}
            onSplit={splitShot}
            onDelete={deleteShot}
            onEditSegment={(id, text) => patchShot(id, { scriptSegment: text })}
          />
        </section>

        <section className="min-h-0 overflow-hidden border-r border-edge">
          {activeShot ? (
            <ShotEditor
              project={project}
              shot={activeShot}
              onChange={(patch) => patchShot(activeShot.id, patch)}
            />
          ) : (
            <div className="p-6 text-sm text-gray-500">
              左侧选择一个镜头开始设计，或先在上方拆分剧本。
            </div>
          )}
        </section>

        <section className="min-h-0 overflow-hidden">
          <PromptPanel project={project} />
        </section>
      </main>
    </div>
  )
}
