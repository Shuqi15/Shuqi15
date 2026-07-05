let counter = 0

/** 简单唯一 id（不依赖 crypto，够用即可） */
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`
}
