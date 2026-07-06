import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  availableBackgroundScenes,
  backgroundSceneBase,
  prefetchBackgroundScene,
  prefetchBackgroundScenesIdle,
  type BackgroundSceneId,
} from '../../books/backgroundScenes'
import { PictureImage } from '../media/PictureImage'

/** Visible hold before the next crossfade begins */
const SLIDE_HOLD_MS = 9000
const FADE_MS = 3200
const BACKGROUND_VERSION = 4

interface HomeBackgroundSlideshowProps {
  active?: boolean
  /** Softer photo during in-book reading focus */
  subdued?: boolean
}

export const HomeBackgroundSlideshow = memo(function HomeBackgroundSlideshow({
  active = true,
  subdued = false,
}: HomeBackgroundSlideshowProps) {
  const scenes = useMemo(() => availableBackgroundScenes(), [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (scenes.length === 0) return
    prefetchBackgroundScene(scenes[0])
    prefetchBackgroundScenesIdle(scenes.slice(1))
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

  useEffect(() => {
    if (scenes.length === 0) return
    const next = scenes[(activeIndex + 1) % scenes.length]
    prefetchBackgroundScene(next)
  }, [activeIndex, scenes])

  if (scenes.length === 0) return null

  return (
    <div
      className={`home-bg-slideshow${active ? ' home-bg-slideshow--active' : ''}${subdued ? ' home-bg-slideshow--subdued' : ''}`}
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
  const [driftKey, setDriftKey] = useState(0)
  const [holdRestPose, setHoldRestPose] = useState(false)

  useEffect(() => {
    if (!isActive) return
    setDriftKey((k) => k + 1)
    setHoldRestPose(true)
  }, [isActive])

  return (
    <div
      className={`home-bg-slide${isActive ? ' home-bg-slide--active' : ''}${holdRestPose && !isActive ? ' home-bg-slide--rest' : ''}`}
      style={
        {
          transitionDuration: `${fadeMs}ms`,
          zIndex: isActive ? 2 : 1,
          ['--home-bg-drift-x' as string]: driftLeft ? '-1.4%' : '1.4%',
          ['--home-bg-drift-duration' as string]: `${SLIDE_HOLD_MS}ms`,
        } as CSSProperties
      }
      data-scene-index={index}
    >
      <PictureImage
        key={driftKey}
        base={backgroundSceneBase(id)}
        version={BACKGROUND_VERSION}
        alt=""
        className="home-bg-slide-img"
        decoding="async"
        fetchPriority={isActive ? 'high' : 'low'}
        draggable={false}
      />
    </div>
  )
}
