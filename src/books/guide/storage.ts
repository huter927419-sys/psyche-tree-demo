import { getJourneySession } from '../../services/journeyApi'

const KEY_OPENED = 'opened'
const KEY_INDEX = 'spread-index'
const KEY_COMPLETED = 'completed'
const KEY_HANDOFF = 'volume-handoff'
const KEY_CONTENT_VERSION = 'content-version'

/** Bump when 序卷 spread structure changes so resume index resets. */
export const GUIDE_CONTENT_VERSION = 33

/** Legacy unscoped keys (pre-login guide storage). */
const LEGACY_KEYS = [
  'psyche-guide-opened',
  'psyche-guide-spread-index',
  'psyche-guide-completed',
  'psyche-guide-volume-handoff',
] as const

const GUIDE_KEY_PREFIX = 'psyche-guide-'

function guideStorageKey(name: string): string | null {
  const { userId } = getJourneySession()
  if (!userId) return null
  return `${GUIDE_KEY_PREFIX}${name}:${userId}`
}

function readFlag(name: string): boolean {
  const key = guideStorageKey(name)
  if (!key) return false
  return localStorage.getItem(key) === '1'
}

function writeFlag(name: string): void {
  const key = guideStorageKey(name)
  if (!key) return
  localStorage.setItem(key, '1')
}

export type GuideShelfState = 'unread' | 'inProgress' | 'completed'

export function hasGuideSession(): boolean {
  return Boolean(getJourneySession().userId)
}

export function getGuideShelfState(): GuideShelfState {
  if (!hasGuideSession()) return 'unread'
  if (readFlag(KEY_COMPLETED)) return 'completed'
  const index = getGuideSpreadIndex()
  if (readFlag(KEY_OPENED) || index > 0) return 'inProgress'
  return 'unread'
}

export function shouldShowGuideFirstVisitHint(): boolean {
  return hasGuideSession() && getGuideShelfState() === 'unread'
}

export function markGuideOpened(): void {
  writeFlag(KEY_OPENED)
}

export function getGuideSpreadIndex(): number {
  const key = guideStorageKey(KEY_INDEX)
  if (!key) return 0
  const versionKey = guideStorageKey(KEY_CONTENT_VERSION)
  if (versionKey) {
    const storedVersion = localStorage.getItem(versionKey)
    if (storedVersion !== String(GUIDE_CONTENT_VERSION)) {
      localStorage.setItem(versionKey, String(GUIDE_CONTENT_VERSION))
      localStorage.removeItem(key)
      return 0
    }
  }
  const raw = localStorage.getItem(key)
  const n = raw ? Number.parseInt(raw, 10) : 0
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function saveGuideSpreadIndex(index: number): void {
  const key = guideStorageKey(KEY_INDEX)
  if (!key) return
  localStorage.setItem(key, String(Math.max(0, index)))
  markGuideOpened()
}

export function markGuideCompleted(): void {
  writeFlag(KEY_COMPLETED)
  writeFlag(KEY_HANDOFF)
  markGuideOpened()
}

export function isGuideVolumeHandoffPending(): boolean {
  if (!hasGuideSession()) return false
  return readFlag(KEY_HANDOFF)
}

export function clearGuideVolumeHandoff(): void {
  const key = guideStorageKey(KEY_HANDOFF)
  if (key) localStorage.removeItem(key)
}

/** Wipe all 序卷 local progress for every user on this device. */
export function clearGuideProgress(): void {
  if (typeof window === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(GUIDE_KEY_PREFIX)) keys.push(key)
  }
  for (const key of keys) localStorage.removeItem(key)
  for (const key of LEGACY_KEYS) localStorage.removeItem(key)
}
