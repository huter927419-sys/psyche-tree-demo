import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  availableBackgroundScenes,
  backgroundSceneSrc,
  type BackgroundSceneId,
} from '../../books/backgroundScenes'

/** Visible hold before the next crossfade begins */
const SLIDE_HOLD_MS = 9000
const FADE_MS = 3200

interface HomeBackgroundSlideshowProps {
  active?: boolean
}

export const HomeBackgroundSlideshow = memo(function HomeBackgroundSlideshow({
  active = true,
}: HomeBackgroundSlideshowProps) {
  const scenes = useMemo(() => availableBackgroundScenes(), [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    scenes.forEach((id) => {
      const img = new Image()
      img.src = backgroundSceneSrc(id)
    })
  }, [scenes])

  useEffect(() => {
    if (!active || scenes.length <= 1) return

    let cancelled = false
    let timer = 0

    const tick = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return
        setActiveIndex((i) => (i + 1) % scenes.length)
        tick()
      }, SLIDE_HOLD_MS)
    }

    tick()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [active, scenes])

  if (scenes.length === 0) return null

  return (
    <div
      className={`home-bg-slideshow${active ? ' home-bg-slideshow--active' : ''}`}
      aria-hidden
    >
      {scenes.map((id, index) => (
        <SlideLayer
          key={id}
          id={id}
          index={index}
          isActive={index === activeIndex}
          fadeMs={FADE_MS}
          driftLeft={index % 2 === 0}
        />
      ))}
      <div className="home-bg-slideshow-scrim" />
    </div>
  )
})

function SlideLayer({
  id,
  index,
  isActive,
  fadeMs,
  driftLeft,
}: {
  id: BackgroundSceneId
  index: number
  isActive: boolean
  fadeMs: number
  driftLeft: boolean
}) {
  return (
    <div
      className={`home-bg-slide${isActive ? ' home-bg-slide--active' : ''}`}
      style={
        {
          transitionDuration: `${fadeMs}ms`,
          zIndex: isActive ? 2 : 1,
          ['--home-bg-drift-x' as string]: driftLeft ? '-1.4%' : '1.4%',
          ['--home-bg-drift-duration' as string]: `${SLIDE_HOLD_MS + fadeMs}ms`,
        } as CSSProperties
      }
      data-scene-index={index}
    >
      <img src={backgroundSceneSrc(id)} alt="" decoding="async" draggable={false} />
    </div>
  )
}
