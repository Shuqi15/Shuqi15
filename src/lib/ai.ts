import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { Project, Shot } from '../types'
import { SYSTEM_L2, buildL2UserMessage } from './l2prompt'

export type Provider = 'claude' | 'openai'

const K_PROVIDER = 'shot-director:provider'
const K_KEY: Record<Provider, string> = {
  claude: 'shot-director:key:claude',
  openai: 'shot-director:key:openai',
}
const K_MODEL: Record<Provider, string> = {
  claude: 'shot-director:model:claude',
  openai: 'shot-director:model:openai',
}

export const DEFAULT_MODEL: Record<Provider, string> = {
  claude: 'claude-opus-4-8',
  openai: 'gpt-4o',
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  claude: 'Claude（Anthropic）',
  openai: 'ChatGPT（OpenAI）',
}

function ls(k: string): string {
  try {
    return localStorage.getItem(k) ?? ''
  } catch {
    return ''
  }
}
function lsSet(k: string, v: string): void {
  try {
    if (v) localStorage.setItem(k, v)
    else localStorage.removeItem(k)
  } catch {
    /* ignore */
  }
}

export function getProvider(): Provider {
  return ls(K_PROVIDER) === 'openai' ? 'openai' : 'claude'
}
export function setProvider(p: Provider): void {
  lsSet(K_PROVIDER, p)
}

export function getApiKey(p: Provider = getProvider()): string {
  return ls(K_KEY[p])
}
export function setApiKey(p: Provider, key: string): void {
  lsSet(K_KEY[p], key)
}

export function getModel(p: Provider = getProvider()): string {
  return ls(K_MODEL[p]) || DEFAULT_MODEL[p]
}
export function setModel(p: Provider, model: string): void {
  lsSet(K_MODEL[p], model.trim() === DEFAULT_MODEL[p] ? '' : model.trim())
}

/** 当前提供商是否已配置 key */
export function hasApiKey(): boolean {
  return getApiKey().trim().length > 0
}

/** —— Claude 通道 —— */
async function viaClaude(project: Project, shot: Shot, prevShot: Shot | null): Promise<string> {
  const client = new Anthropic({ apiKey: getApiKey('claude'), dangerouslyAllowBrowser: true })
  const msg = await client.messages.create({
    model: getModel('claude'),
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM_L2,
    messages: [{ role: 'user', content: buildL2UserMessage(project, shot, prevShot) }],
  })
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

/** —— OpenAI (ChatGPT) 通道 —— */
async function viaOpenAI(project: Project, shot: Shot, prevShot: Shot | null): Promise<string> {
  const client = new OpenAI({ apiKey: getApiKey('openai'), dangerouslyAllowBrowser: true })
  const resp = await client.chat.completions.create({
    model: getModel('openai'),
    messages: [
      { role: 'system', content: SYSTEM_L2 },
      { role: 'user', content: buildL2UserMessage(project, shot, prevShot) },
    ],
  })
  return (resp.choices[0]?.message?.content ?? '').trim()
}

/**
 * L2 生成：为单个镜头产出统一格式的分镜提示词。
 * 按当前提供商（Claude / OpenAI）走对应通道。
 */
export async function generateShotPrompt(project: Project, shot: Shot): Promise<string> {
  const idx = project.shots.findIndex((s) => s.id === shot.id)
  const prevShot = idx > 0 ? project.shots[idx - 1] : null
  return getProvider() === 'openai'
    ? viaOpenAI(project, shot, prevShot)
    : viaClaude(project, shot, prevShot)
}
