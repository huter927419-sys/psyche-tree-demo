import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  getGuideIllustrationMotion,
  GUIDE_ILLUSTRATION_IMG_ANIMATIONS,
} from '../../books/guide/illustrationMotion'
import {
  guideIllustrationBase,
  guideIllustrationVersion,
} from '../../books/guide/illustrations'
import { PictureImage } from '../media/PictureImage'

interface GuideIllustrationProps {
  id: string
  spreadIndex: number
  ready?: boolean
  tone?: 'hero' | 'ghost' | 'companion' | 'echo'
  onMotionComplete?: () => void
}

export function GuideIllustration({
  id,
  spreadIndex,
  ready = true,
  tone = 'hero',
  onMotionComplete,
}: GuideIllustrationProps) {
  const motion = getGuideIllustrationMotion(id)
  const imgAnimationName = GUIDE_ILLUSTRATION_IMG_ANIMATIONS[motion.variant]
  const motionKey = `${spreadIndex}-${id}`
  const [revealed, setRevealed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const motionCompleteRef = useRef(false)
  const isPhoto = id.startsWith('v-')

  const beginReveal = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true))
    })
  }

  useEffect(() => {
    motionCompleteRef.current = false
    setRevealed(false)
    setLoaded(false)
    setFailed(false)
    if (!ready) return undefined

    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
      beginReveal()
      return undefined
    }

    const fallback = window.setTimeout(() => {
      setLoaded(true)
      setRevealed(true)
    }, 480)
    return () => window.clearTimeout(fallback)
  }, [motionKey, ready])

  const handleLoad = () => {
    setLoaded(true)
    setFailed(false)
    if (!ready) return
    beginReveal()
  }

  const handleError = () => {
    setFailed(true)
    setLoaded(false)
    setRevealed(true)
    if (onMotionComplete && !motionCompleteRef.current) {
      motionCompleteRef.current = true
      onMotionComplete()
    }
  }

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== imgAnimationName) return
    if (motionCompleteRef.current) return
    motionCompleteRef.current = true
    onMotionComplete?.()
  }

  useEffect(() => {
    if (tone !== 'ghost' && tone !== 'companion' && tone !== 'echo') return undefined
    if (!loaded || !ready) return undefined
    setRevealed(true)
    if (!onMotionComplete || motionCompleteRef.current) return undefined
    const delayMs = tone === 'ghost' ? 900 : 720
    const timer = window.setTimeout(() => {
      if (motionCompleteRef.current) return
      motionCompleteRef.current = true
      onMotionComplete()
    }, delayMs)
    return () => window.clearTimeout(timer)
  }, [loaded, motionKey, onMotionComplete, ready, tone])

  useEffect(() => {
    if (!revealed || !onMotionComplete) return undefined
    if (typeof window === 'undefined') return undefined
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setTimeout(() => {
      if (motionCompleteRef.current) return
      motionCompleteRef.current = true
      onMotionComplete()
    }, 700)

    return () => window.clearTimeout(timer)
  }, [motionKey, onMotionComplete, revealed])

  const motionStyle = {
    '--guide-illustration-duration': `${motion.durationS}s`,
    '--guide-illustration-mist-ratio': String(motion.mistRatio),
    ...(motion.heroObjectPosition && tone === 'hero'
      ? { '--guide-illustration-object-position': motion.heroObjectPosition }
      : {}),
  } as CSSProperties

  const variantClass = `guide-spread-illustration--${motion.variant}`
  const photoClass = isPhoto ? ' guide-spread-illustration--photo' : ''
  const toneClass =
    tone === 'ghost'
      ? ' guide-spread-illustration--ghost'
      : tone === 'companion'
        ? ' guide-spread-illustration--companion'
        : tone === 'echo'
          ? ' guide-spread-illustration--echo'
          : ''
  const noMistClass = motion.mistRatio <= 0 ? ' guide-spread-illustration--no-mist' : ''
  const stateClass = `${revealed ? ' guide-spread-illustration--revealing' : ''}${loaded ? ' guide-spread-illustration--loaded' : ''}${failed ? ' guide-spread-illustration--failed' : ''}`

  return (
    <figure
      className={`guide-spread-illustration ${variantClass}${photoClass}${toneClass}${noMistClass}${stateClass}`}
      style={motionStyle}
    >
      <PictureImage
        ref={imgRef}
        key={motionKey}
        base={guideIllustrationBase(id)}
        version={guideIllustrationVersion()}
        webp={false}
        alt=""
        className="guide-spread-illustration-img"
        loading="eager"
        decoding="async"
        fetchPriority={tone === 'hero' || tone === 'companion' ? 'high' : 'low'}
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
        onAnimationEnd={handleAnimationEnd}
      />
      <div className="guide-spread-illustration-veil" aria-hidden />
      {motion.mistRatio > 0 && (
        <div className="guide-spread-illustration-mist" aria-hidden />
      )}
    </figure>
  )
}
