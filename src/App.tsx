import { useEffect, useMemo, useState } from 'react'
import type { DurationLimit, Project, Shot } from './types'
import { PLATFORMS } from './data/platforms'
import { defaultSelections } from './data/options'
import { buildShots, renumberAndReallocate, shotsFromSegments, splitScript } from './lib/splitter'
import { loadProject, saveProject } from './lib/storage'
import {
  PROVIDERS,
  PROVIDER_BY_ID,
  aiSplitScript,
  generateShotPrompt,
  getApiKey,
  getBaseURL,
  getModel,
  getProviderId,
  hasApiKey,
  setApiKey,
  setBaseURL,
  setModel,
  setProviderId,
} from './lib/ai'
import { uid } from './lib/id'
import ShotList from './components/ShotList'
import ShotEditor from './components/ShotEditor'
import PromptPanel from './components/PromptPanel'

const DURATIONS: DurationLimit[] = [10, 15, 30]

function newProject(): Project {
  return {
    id: uid('proj'),
    title: '未命名短剧',
    scriptText: '',
    platformId: 'seedance',
    durationLimit: 15,
    toneRef: '',
    shots: [],
    updatedAt: Date.now(),
  }
}

export default function App() {
  const [project, setProject] = useState<Project>(() => loadProject() ?? newProject())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scriptDraft, setScriptDraft] = useState(project.scriptText)
  const [provider, setProviderState] = useState<string>(getProviderId())
  const [apiKey, setKey] = useState(getApiKey(getProviderId()))
  const [modelInput, setModelInput] = useState(getModel(getProviderId()))
  const [baseURLInput, setBaseURLInput] = useState(getBaseURL(getProviderId()))
  const [showKey, setShowKey] = useState(!hasApiKey())

  // 切换提供商时，载入该提供商已存的 key / model / baseURL
  function switchProvider(id: string) {
    setProviderState(id)
    setKey(getApiKey(id))
    setModelInput(getModel(id))
    setBaseURLInput(getBaseURL(id))
  }
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [splitting, setSplitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function doSplit() {
    const shots = buildShots(scriptDraft, project.durationLimit)
    setProject((p) => ({ ...p, scriptText: scriptDraft, shots }))
    setActiveId(shots[0]?.id ?? null)
  }

  async function doAiSplit() {
    if (!scriptDraft.trim()) return
    setError(null)
    setSplitting(true)
    try {
      const segments = await aiSplitScript(scriptDraft, project.durationLimit)
      if (segments.length === 0) throw new Error('AI 未返回可用的拆分结果，请重试或用规则拆分。')
      const shots = shotsFromSegments(segments, project.durationLimit)
      setProject((p) => ({ ...p, scriptText: scriptDraft, shots }))
      setActiveId(shots[0]?.id ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSplitting(false)
    }
  }

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
      scriptSegment: `${prev.scriptSegment} ${cur.scriptSegment}`.trim(),
      directorNote: [prev.directorNote, cur.directorNote].filter(Boolean).join('；'),
      aiOutput: undefined, // 合并后需重生成
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
      directorNote: i === 0 ? cur.directorNote : '',
      anchorNote: i === 0 ? cur.anchorNote : '',
      selections: i === 0 ? cur.selections : defaultSelections(),
      extras: i === 0 ? cur.extras : [],
      checklist: i === 0 ? cur.checklist : {},
      duration: 0,
      aiOutput: undefined,
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

  async function handleGenerate(shot: Shot) {
    setError(null)
    setGeneratingId(shot.id)
    try {
      // 用最新 project 状态生成（含上一镜承接）
      const text = await generateShotPrompt(project, shot)
      patchShot(shot.id, { aiOutput: text })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setGeneratingId(null)
    }
  }

  function saveKey() {
    setProviderId(provider)
    setApiKey(provider, apiKey.trim())
    setModel(provider, modelInput)
    if (PROVIDER_BY_ID[provider]?.editableBaseURL) setBaseURL(provider, baseURLInput)
    setShowKey(false)
    setError(null)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 顶栏 */}
      <header className="flex flex-wrap items-center gap-3 border-b border-edge bg-panel px-4 py-2.5">
        <div className="text-sm font-bold tracking-wide text-accent">🎬 分镜导演台</div>
        <input
          value={project.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-32 rounded border border-edge bg-ink px-2 py-1 text-sm text-gray-200 outline-none focus:border-accent"
        />
        <input
          value={project.toneRef}
          onChange={(e) => update({ toneRef: e.target.value })}
          placeholder="影调风格参考（如《继承之战》冷峻资本气质）"
          className="w-56 rounded border border-edge bg-ink px-2 py-1 text-xs text-gray-200 outline-none focus:border-accent"
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
                    project.durationLimit === d ? 'bg-accent text-ink' : 'bg-ink text-gray-300 hover:bg-edge',
                  ].join(' ')}
                >
                  {d}s
                </button>
              ))}
            </div>
          </label>
          <button
            onClick={() => setShowKey((v) => !v)}
            className={[
              'rounded border px-2 py-1',
              hasApiKey() ? 'border-green-700 text-green-400' : 'border-yellow-700 text-yellow-400',
            ].join(' ')}
            title="设置 Claude API Key（存本地）"
          >
            {hasApiKey() ? 'Key ✓' : '设置 Key'}
          </button>
        </div>
      </header>

      {/* API Key 面板 */}
      {showKey && (
        <div className="flex flex-wrap items-center gap-2 border-b border-edge bg-ink px-4 py-2 text-xs">
          <label className="flex items-center gap-1">
            <span className="text-gray-400">AI 提供商</span>
            <select
              value={provider}
              onChange={(e) => switchProvider(e.target.value)}
              className="rounded border border-edge bg-panel px-2 py-1 text-gray-200 outline-none"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setKey(e.target.value)}
            placeholder={`${PROVIDER_BY_ID[provider]?.keyHint ?? 'sk-...'}（Key）`}
            className="w-56 rounded border border-edge bg-panel px-2 py-1 text-gray-200 outline-none focus:border-accent2"
          />
          <label className="flex items-center gap-1">
            <span className="text-gray-400">模型</span>
            <input
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
              placeholder={PROVIDER_BY_ID[provider]?.defaultModel || 'model 名'}
              className="w-40 rounded border border-edge bg-panel px-2 py-1 text-gray-200 outline-none focus:border-accent2"
            />
          </label>
          {PROVIDER_BY_ID[provider]?.editableBaseURL && (
            <label className="flex items-center gap-1">
              <span className="text-gray-400">接口地址</span>
              <input
                value={baseURLInput}
                onChange={(e) => setBaseURLInput(e.target.value)}
                placeholder="https://api.xxx.com/v1"
                className="w-52 rounded border border-edge bg-panel px-2 py-1 text-gray-200 outline-none focus:border-accent2"
              />
            </label>
          )}
          <button onClick={saveKey} className="rounded bg-accent2 px-3 py-1 font-semibold text-ink hover:brightness-110">
            保存
          </button>
          {PROVIDER_BY_ID[provider]?.keysUrl && (
            <span className="text-gray-500">拿 Key：{PROVIDER_BY_ID[provider]?.keysUrl}</span>
          )}
          <span className="text-gray-500">仅存本地浏览器、不上传。</span>
        </div>
      )}

      {/* 剧本输入条 */}
      <div className="flex items-start gap-2 border-b border-edge bg-ink px-4 py-2.5">
        <textarea
          value={scriptDraft}
          onChange={(e) => setScriptDraft(e.target.value)}
          placeholder="在此粘贴剧本 / 剧情 / 台词。例如：明窈将合同往桌上一推。裴渡缓缓直起身，冷笑。「你觉得，你有得选？」"
          className="h-16 flex-1 resize-y rounded-md border border-edge bg-panel p-2 text-sm text-gray-200 outline-none focus:border-accent"
        />
        <div className="flex h-16 shrink-0 flex-col gap-1.5">
          <button
            onClick={doSplit}
            className="flex-1 rounded-md bg-accent px-4 text-sm font-semibold text-ink hover:brightness-110"
          >
            拆分分镜 →
          </button>
          <button
            onClick={doAiSplit}
            disabled={splitting || !hasApiKey()}
            className="flex-1 rounded-md border border-accent2 px-4 text-xs font-semibold text-accent2 hover:bg-accent2/10 disabled:cursor-not-allowed disabled:opacity-40"
            title={hasApiKey() ? 'AI 按语义+时长智能拆分' : '需先填 API Key'}
          >
            {splitting ? 'AI 拆分中…' : '⚡ AI 智能拆分'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border-b border-red-900 bg-red-950/50 px-4 py-1.5 text-xs text-red-300">
          生成失败：{error}
        </div>
      )}

      {/* 三栏主体 */}
      <main className="grid min-h-0 flex-1 grid-cols-[280px_1fr_360px]">
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
              shot={activeShot}
              platformId={project.platformId}
              generating={generatingId === activeShot.id}
              hasKey={hasApiKey()}
              onChange={(patch) => patchShot(activeShot.id, patch)}
              onGenerate={() => handleGenerate(activeShot)}
            />
          ) : (
            <div className="p-6 text-sm text-gray-500">左侧选择一个镜头开始设计，或先在上方拆分剧本。</div>
          )}
        </section>

        <section className="min-h-0 overflow-hidden">
          <PromptPanel project={project} />
        </section>
      </main>
    </div>
  )
}
