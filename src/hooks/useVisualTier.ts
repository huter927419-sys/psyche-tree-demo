import { useEffect, useState } from 'react'

export type VisualTier = 'full' | 'balanced' | 'minimal'

function detectVisualTier(): VisualTier {
  if (typeof window === 'undefined') return 'balanced'

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'minimal'
  }

  const coarseCpu =
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 4

  const saveData =
    'connection' in navigator &&
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData

  if (coarseCpu || saveData) return 'minimal'

  return 'balanced'
}

function resolveTier(preferred: VisualTier, detected: VisualTier): VisualTier {
  if (detected === 'minimal') return 'minimal'
  if (preferred === 'minimal') return 'minimal'
  if (preferred === 'full' && detected === 'balanced') return 'full'
  if (preferred === 'full') return 'full'
  return detected
}

export function useVisualTier(preferred: VisualTier = 'balanced'): VisualTier {
  const [tier, setTier] = useState<VisualTier>(() =>
    resolveTier(preferred, detectVisualTier()),
  )

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setTier(resolveTier(preferred, detectVisualTier()))
    }
    apply()
    motion.addEventListener('change', apply)
    return () => motion.removeEventListener('change', apply)
  }, [preferred])

  return tier
}

/** Only keep flowing supply on recently lit segments — avoids dozens of simultaneous loops. */
export function shouldRunEnergySupply(
  itemStage: number,
  revealStage: number,
  variant: 'welcome' | 'explore' | 'complete',
  tier: VisualTier,
): boolean {
  if (tier === 'minimal') return false
  // Shelf/cover welcome: static tree glow only — no parallel supply loops.
  if (variant === 'welcome') return false
  if (variant === 'complete') return tier === 'full'
  if (tier === 'balanced') {
    return itemStage >= revealStage - 1 && itemStage <= revealStage
  }
  return itemStage <= revealStage
}
