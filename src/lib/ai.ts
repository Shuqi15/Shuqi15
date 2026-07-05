import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { Project, Shot } from '../types'
import { SYSTEM_L2, buildL2UserMessage } from './l2prompt'

/** 提供商类型：anthropic 走 Claude SDK；openai 走 OpenAI 兼容接口（含 DeepSeek 等） */
export interface ProviderInfo {
  id: string
  label: string
  kind: 'anthropic' | 'openai'
  /** openai 兼容接口的 baseURL；留空表示 OpenAI 官方默认 */
  baseURL?: string
  defaultModel: string
  keyHint: string
  /** 拿 key 的网址（提示用） */
  keysUrl?: string
  /** 是否允许用户自填 baseURL（自定义提供商） */
  editableBaseURL?: boolean
}

/** 内置提供商列表 —— 想加新的，往这里加一条即可 */
export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'claude',
    label: 'Claude（Anthropic）',
    kind: 'anthropic',
    defaultModel: 'claude-opus-4-8',
    keyHint: 'sk-ant-...',
    keysUrl: 'https://console.anthropic.com',
  },
  {
    id: 'openai',
    label: 'ChatGPT（OpenAI）',
    kind: 'openai',
    defaultModel: 'gpt-4o',
    keyHint: 'sk-...',
    keysUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    kind: 'openai',
    baseURL: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    keyHint: 'sk-...',
    keysUrl: 'https://platform.deepseek.com/api_keys',
  },
  {
    id: 'custom',
    label: '自定义（任意 OpenAI 兼容接口）',
    kind: 'openai',
    defaultModel: '',
    keyHint: 'sk-...',
    editableBaseURL: true,
  },
]

export const PROVIDER_BY_ID: Record<string, ProviderInfo> = Object.fromEntries(
  PROVIDERS.map((p) => [p.id, p]),
)

const K_PROVIDER = 'shot-director:provider'
const k = (kind: string, id: string) => `shot-director:${kind}:${id}`

function ls(key: string): string {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}
function lsSet(key: string, v: string): void {
  try {
    if (v) localStorage.setItem(key, v)
    else localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function getProviderId(): string {
  const id = ls(K_PROVIDER)
  return PROVIDER_BY_ID[id] ? id : 'claude'
}
export function setProviderId(id: string): void {
  lsSet(K_PROVIDER, id)
}

export function getApiKey(id: string = getProviderId()): string {
  return ls(k('key', id))
}
export function setApiKey(id: string, key: string): void {
  lsSet(k('key', id), key.trim())
}

export function getModel(id: string = getProviderId()): string {
  return ls(k('model', id)) || PROVIDER_BY_ID[id]?.defaultModel || ''
}
export function setModel(id: string, model: string): void {
  const def = PROVIDER_BY_ID[id]?.defaultModel ?? ''
  lsSet(k('model', id), model.trim() === def ? '' : model.trim())
}

/** 自定义提供商的 baseURL */
export function getBaseURL(id: string = getProviderId()): string {
  const info = PROVIDER_BY_ID[id]
  if (info?.editableBaseURL) return ls(k('baseurl', id))
  return info?.baseURL ?? ''
}
export function setBaseURL(id: string, url: string): void {
  lsSet(k('baseurl', id), url.trim())
}

/** 当前提供商是否已配置 key */
export function hasApiKey(): boolean {
  return getApiKey().trim().length > 0
}

async function viaClaude(project: Project, shot: Shot, prev: Shot | null): Promise<string> {
  const client = new Anthropic({ apiKey: getApiKey(), dangerouslyAllowBrowser: true })
  const msg = await client.messages.create({
    model: getModel(),
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM_L2,
    messages: [{ role: 'user', content: buildL2UserMessage(project, shot, prev) }],
  })
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

async function viaOpenAICompatible(project: Project, shot: Shot, prev: Shot | null): Promise<string> {
  const id = getProviderId()
  const baseURL = getBaseURL(id)
  const client = new OpenAI({
    apiKey: getApiKey(id),
    ...(baseURL ? { baseURL } : {}),
    dangerouslyAllowBrowser: true,
  })
  const resp = await client.chat.completions.create({
    model: getModel(id),
    messages: [
      { role: 'system', content: SYSTEM_L2 },
      { role: 'user', content: buildL2UserMessage(project, shot, prev) },
    ],
  })
  return (resp.choices[0]?.message?.content ?? '').trim()
}

/** L2 生成：按当前提供商走对应通道 */
export async function generateShotPrompt(project: Project, shot: Shot): Promise<string> {
  const idx = project.shots.findIndex((s) => s.id === shot.id)
  const prev = idx > 0 ? project.shots[idx - 1] : null
  const info = PROVIDER_BY_ID[getProviderId()]
  return info?.kind === 'anthropic'
    ? viaClaude(project, shot, prev)
    : viaOpenAICompatible(project, shot, prev)
}
