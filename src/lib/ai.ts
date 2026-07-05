import Anthropic from '@anthropic-ai/sdk'
import type { Project, Shot } from '../types'
import { SYSTEM_L2, buildL2UserMessage } from './l2prompt'

const KEY_STORE = 'shot-director:apikey'

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY_STORE) ?? ''
  } catch {
    return ''
  }
}

export function setApiKey(key: string): void {
  try {
    if (key) localStorage.setItem(KEY_STORE, key)
    else localStorage.removeItem(KEY_STORE)
  } catch {
    /* ignore */
  }
}

export function hasApiKey(): boolean {
  return getApiKey().trim().length > 0
}

function client(): Anthropic {
  return new Anthropic({
    apiKey: getApiKey(),
    // 纯前端无后端：从用户浏览器直连 Claude API。key 仅存本地。
    dangerouslyAllowBrowser: true,
  })
}

/**
 * L2 生成：为单个镜头产出统一格式的分镜提示词。
 * 传入整片 shots 以便承接上一镜（衔接锁 / 左右关系）。
 */
export async function generateShotPrompt(project: Project, shot: Shot): Promise<string> {
  const idx = project.shots.findIndex((s) => s.id === shot.id)
  const prevShot = idx > 0 ? project.shots[idx - 1] : null

  const message = await client().messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM_L2,
    messages: [{ role: 'user', content: buildL2UserMessage(project, shot, prevShot) }],
  })

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()

  return text
}
