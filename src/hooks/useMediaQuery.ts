import { useSyncExternalStore } from 'react'

export const GUIDE_MOBILE_QUERY = '(max-width: 767px)'

export function isGuideMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(GUIDE_MOBILE_QUERY).matches
}

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

function getMediaQuerySnapshot(query: string): boolean {
  return window.matchMedia(query).matches
}

/** Subscribes to matchMedia without a post-mount flash (unlike useState + useEffect). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(query, onStoreChange),
    () => getMediaQuerySnapshot(query),
    () => false,
  )
}
