import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BackgroundMusicPlayer,
  type MusicPhase,
} from '../audio/backgroundMusic'
import type { Locale } from '../i18n/locale'
import { getUi } from '../i18n/ui'

interface AmbientMusicControlProps {
  phase: MusicPhase
  awakeningStage: number | null
  bootstrap?: number
  locale?: Locale
}

export function AmbientMusicControl({
  phase,
  awakeningStage,
  bootstrap = 0,
  locale = 'zh',
}: AmbientMusicControlProps) {
  const ui = getUi(locale)
  const player = useRef<BackgroundMusicPlayer | null>(null)
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem('psyche-music') !== 'off'
  })
  const [active, setActive] = useState(false)
  const prevAwakening = useRef<number | null>(null)

  useEffect(() => {
    player.current = new BackgroundMusicPlayer()
    return () => {
      player.current?.stop()
      player.current = null
    }
  }, [])

  useEffect(() => {
    void player.current?.setPhase(phase)
  }, [phase])

  useEffect(() => {
    player.current?.setMuted(!enabled)
    sessionStorage.setItem('psyche-music', enabled ? 'on' : 'off')
  }, [enabled])

  useEffect(() => {
    if (
      awakeningStage !== null &&
      awakeningStage !== prevAwakening.current &&
      active &&
      enabled
    ) {
      player.current?.playAwakeningChime()
    }
    prevAwakening.current = awakeningStage
  }, [awakeningStage, active, enabled])

  const ensureStarted = useCallback(async () => {
    const ok = await player.current?.start(phase)
    if (ok) setActive(true)
    return ok
  }, [phase])

  useEffect(() => {
    if (bootstrap > 0 && enabled) {
      void ensureStarted()
    }
  }, [bootstrap, enabled, ensureStarted])

  const toggle = async () => {
    if (!active) {
      await ensureStarted()
      setEnabled(true)
      return
    }
    setEnabled((v) => !v)
  }

  return (
    <div className="ambient-music-control">
      {!active && (
        <button
          type="button"
          className="ambient-music-btn ambient-music-btn-hint"
          onClick={() => void ensureStarted().then(() => setEnabled(true))}
        >
          {ui.musicEnable}
        </button>
      )}
      <button
        type="button"
        className="ambient-music-btn"
        onClick={() => void toggle()}
        aria-label={enabled && active ? ui.musicAriaOn : ui.musicAriaOff}
        aria-pressed={enabled && active}
      >
        <span className="ambient-music-icon" aria-hidden>
          {enabled && active ? '♪' : '♪̸'}
        </span>
        <span className="ambient-music-label">
          {enabled && active ? ui.musicOn : ui.musicOff}
        </span>
      </button>
    </div>
  )
}
