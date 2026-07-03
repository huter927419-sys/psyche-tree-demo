export type MusicPhase = 'welcome' | 'questions' | 'result'

/** Mixkit Free Stock Music License — https://mixkit.co/license/#musicFree */
export const MUSIC_TRACKS: Record<MusicPhase, { src: string; title: string }> = {
  welcome: {
    src: '/audio/meditation-sitar.mp3',
    title: 'Meditation Sitar (Mixkit)',
  },
  questions: {
    src: '/audio/deep-calm.mp3',
    title: 'Deep Calm (Mixkit)',
  },
  result: {
    src: '/audio/ethereal-dream.mp3',
    title: 'Ethereal Dream (Mixkit)',
  },
}

const PHASE_VOLUME: Record<MusicPhase, number> = {
  welcome: 0.34,
  questions: 0.24,
  result: 0.3,
}

const FADE_MS = 1600

function rampVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  ms: number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      audio.volume = from + (to - from) * t
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

export class BackgroundMusicPlayer {
  private audio: HTMLAudioElement | null = null
  private phase: MusicPhase = 'welcome'
  private muted = false
  private started = false

  async start(phase: MusicPhase = 'welcome'): Promise<boolean> {
    this.phase = phase
    try {
      await this.switchTrack(phase, true)
      this.started = true
      return true
    } catch {
      return false
    }
  }

  async setPhase(phase: MusicPhase) {
    if (!this.started || phase === this.phase) return
    this.phase = phase
    await this.switchTrack(phase, false)
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (!this.audio) return
    const target = muted ? 0 : PHASE_VOLUME[this.phase]
    void rampVolume(this.audio, this.audio.volume, target, muted ? 800 : 1200)
  }

  stop() {
    if (!this.audio) return
    const el = this.audio
    void rampVolume(el, el.volume, 0, 800).then(() => {
      el.pause()
      el.src = ''
    })
    this.audio = null
    this.started = false
  }

  /** Soft bell overlay — keeps music playing underneath */
  playAwakeningChime() {
    if (this.muted || typeof window === 'undefined') return
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    void ctx.resume().then(() => {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.12, now + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.5)
      osc.onended = () => void ctx.close()
    })
  }

  private async switchTrack(phase: MusicPhase, initial: boolean) {
    const { src } = MUSIC_TRACKS[phase]
    const next = new Audio(src)
    next.loop = true
    next.preload = 'auto'
    next.volume = 0

    await next.play()

    const target = this.muted ? 0 : PHASE_VOLUME[phase]
    const prev = this.audio

    if (prev) {
      await Promise.all([
        rampVolume(next, 0, target, FADE_MS),
        rampVolume(prev, prev.volume, 0, FADE_MS),
      ])
      prev.pause()
      prev.src = ''
    } else {
      await rampVolume(next, 0, target, initial ? 2200 : FADE_MS)
    }

    this.audio = next
  }
}
