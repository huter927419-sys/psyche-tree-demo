import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  getGuideIllustrationMotion,
  GUIDE_ILLUSTRATION_IMG_ANIMATIONS,
} from '../../books/guide/illustrationMotion'
import { guideIllustrationSrc } from '../../books/guide/illustrations'

interface GuideIllustrationProps {
  id: string
  /** Changes when user lands on a spread — restarts the walk-in reveal. */
  spreadIndex: number
  /** Wait until the spread rests (page turn finished) before revealing. */
  ready?: boolean
  onMotionComplete?: () => void
}

export function GuideIllustration({
  id,
  spreadIndex,
  ready = true,
  onMotionComplete,
}: GuideIllustrationProps) {
  const motion = getGuideIllustrationMotion(id)
  const imgAnimationName = GUIDE_ILLUSTRATION_IMG_ANIMATIONS[motion.variant]
  const motionKey = `${spreadIndex}-${id}`
  const [revealed, setRevealed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const motionCompleteRef = useRef(false)

  useEffect(() => {
    motionCompleteRef.current = false
    setRevealed(false)
    const img = imgRef.current
    if (!ready || !img) return undefined

    const beginReveal = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setRevealed(true))
      })
    }

    if (img.complete && img.naturalWidth > 0) {
      beginReveal()
    }

    return undefined
  }, [motionKey, ready])

  const handleLoad = () => {
    if (!ready) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true))
    })
  }

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== imgAnimationName) return
    if (motionCompleteRef.current) return
    motionCompleteRef.current = true
    onMotionComplete?.()
  }

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
  } as CSSProperties

  const variantClass = `guide-spread-illustration--${motion.variant}`
  const noMistClass = motion.mistRatio <= 0 ? ' guide-spread-illustration--no-mist' : ''

  return (
    <figure
      className={`guide-spread-illustration ${variantClass}${noMistClass}${revealed ? ' guide-spread-illustration--revealing' : ''}`}
      style={motionStyle}
    >
      <img
        ref={imgRef}
        key={motionKey}
        src={guideIllustrationSrc(id)}
        alt=""
        className="guide-spread-illustration-img"
        loading="eager"
        decoding="async"
        draggable={false}
        onLoad={handleLoad}
        onAnimationEnd={handleAnimationEnd}
      />
      <div className="guide-spread-illustration-veil" aria-hidden />
      {motion.mistRatio > 0 && (
        <div className="guide-spread-illustration-mist" aria-hidden />
      )}
    </figure>
  )
}
