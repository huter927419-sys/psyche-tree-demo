const OPENED_KEY = 'psyche-guide-opened'
const INDEX_KEY = 'psyche-guide-spread-index'
const COMPLETED_KEY = 'psyche-guide-completed'
const HANDOFF_KEY = 'psyche-guide-volume-handoff'

export type GuideShelfState = 'unread' | 'inProgress' | 'completed'

export function getGuideShelfState(): GuideShelfState {
  if (localStorage.getItem(COMPLETED_KEY) === '1') return 'completed'
  const index = getGuideSpreadIndex()
  if (localStorage.getItem(OPENED_KEY) === '1' || index > 0) return 'inProgress'
  return 'unread'
}

export function shouldShowGuideFirstVisitHint(): boolean {
  return getGuideShelfState() === 'unread'
}

export function markGuideOpened(): void {
  localStorage.setItem(OPENED_KEY, '1')
}

export function getGuideSpreadIndex(): number {
  const raw = localStorage.getItem(INDEX_KEY)
  const n = raw ? Number.parseInt(raw, 10) : 0
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function saveGuideSpreadIndex(index: number): void {
  localStorage.setItem(INDEX_KEY, String(Math.max(0, index)))
  markGuideOpened()
}

export function markGuideCompleted(): void {
  localStorage.setItem(COMPLETED_KEY, '1')
  localStorage.setItem(HANDOFF_KEY, '1')
  markGuideOpened()
}

export function isGuideVolumeHandoffPending(): boolean {
  return localStorage.getItem(HANDOFF_KEY) === '1'
}

export function clearGuideVolumeHandoff(): void {
  localStorage.removeItem(HANDOFF_KEY)
}
