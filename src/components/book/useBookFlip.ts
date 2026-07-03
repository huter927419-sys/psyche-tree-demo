import { useCallback, useState } from 'react'
import { FLIP_DURATION_MS } from './bookUtils'

export function useBookFlip(onIndexChange: (index: number) => void) {
  const [flipping, setFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)

  const runFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number) => {
      if (flipping) return false
      setFlipDirection(direction)
      setPendingIndex(targetIndex)
      setFlipping(true)
      window.setTimeout(() => {
        onIndexChange(targetIndex)
        setPendingIndex(null)
        setFlipping(false)
      }, FLIP_DURATION_MS)
      return true
    },
    [flipping, onIndexChange],
  )

  return { flipping, flipDirection, pendingIndex, runFlip }
}
