export const FLIP_DURATION_MS = 1050

const CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾']

export function toChinesePage(n: number): string {
  if (n <= 10) return CN_NUM[n] ?? String(n)
  return String(n)
}

export function formatPageLabel(current: number, total: number): string {
  return `${toChinesePage(current)} / ${toChinesePage(total)}`
}
