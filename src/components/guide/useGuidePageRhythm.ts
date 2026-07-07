import { useCallback, useEffect, useRef } from 'react'
import type { GuidePageBlock } from '../../books/guide/types'
import { blockHasTextRhythm } from '../../books/guide/guideTextRhythm'

export function useGuidePageRhythm(
  blocks: readonly GuidePageBlock[],
  rhythmActive: boolean,
  onRhythmComplete?: () => void,
) {
  const segmentCount = blocks.filter(blockHasTextRhythm).length
  const doneRef = useRef(0)
  const reportedRef = useRef(false)

  useEffect(() => {
    doneRef.current = 0
    reportedRef.current = false
  }, [blocks, rhythmActive])

  const reportSegmentComplete = useCallback(() => {
    if (!rhythmActive || !onRhythmComplete || segmentCount <= 0) return
    doneRef.current += 1
    if (doneRef.current >= segmentCount && !reportedRef.current) {
      reportedRef.current = true
      onRhythmComplete()
    }
  }, [onRhythmComplete, rhythmActive, segmentCount])

  return reportSegmentComplete
}
