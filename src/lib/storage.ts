import type { Project } from '../types'

const KEY = 'shot-director:project'

export function saveProject(project: Project): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(project))
  } catch {
    // 存储失败时静默（例如无痕模式），不阻断使用
  }
}

export function loadProject(): Project | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as Project
  } catch {
    return null
  }
}
