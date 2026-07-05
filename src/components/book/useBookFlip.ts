import { useCallback, useEffect, useRef, useState } from 'react'
import { FLIP_DURATION_MS } from './bookUtils'

export function useBookFlip(onIndexChange: (index: number) => void) {
  const [flipping, setFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const [flipSerial, setFlipSerial] = useState(0)
  const pendingRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  const completeFlip = useCallback(() => {
    const target = pendingRef.current
    if (target === null || completedRef.current) return
    completedRef.current = true
    pendingRef.current = null
    onIndexChange(target)
    setPendingIndex(null)
    setFlipping(false)
    requestAnimationFrame(() => {
      completedRef.current = false
    })
  }, [onIndexChange])

  const runFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number) => {
      if (flipping) return false
      setFlipDirection(direction)
      setPendingIndex(targetIndex)
      pendingRef.current = targetIndex
      completedRef.current = false
      setFlipSerial((n) => n + 1)
      setFlipping(true)
      return true
    },
    [flipping],
  )

  useEffect(() => {
    if (!flipping) return
    const t = window.setTimeout(completeFlip, FLIP_DURATION_MS + 80)
    return () => window.clearTimeout(t)
  }, [flipping, flipSerial, completeFlip])

  return {
    flipping,
    flipDirection,
    pendingIndex,
    flipSerial,
    runFlip,
    completeFlip,
  }
}
