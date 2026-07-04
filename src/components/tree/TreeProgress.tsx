import type { BookId } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getProgressLabels } from '../../i18n/treeLabels'
import { BilingualCrossfadeText } from '../i18n/BilingualCrossfadeText'

interface TreeProgressProps {
  revealStage: number
  bookId: BookId
  locale: Locale
}

export function TreeProgress({ revealStage, bookId, locale }: TreeProgressProps) {
  const labels = getProgressLabels(bookId, locale)
  const zhLabels = getProgressLabels(bookId, 'zh')
  const enLabels = getProgressLabels(bookId, 'en')
  const jaLabels = getProgressLabels(bookId, 'ja')
  const label = labels.stageLabels[revealStage]

  return (
    <div className="tree-progress-hud">
      <div className="tree-progress-dots">
        {labels.stageShort.map((short, i) => {
          const stage = i + 1
          const lit = revealStage >= stage
          const active = revealStage === stage
          return (
            <div
              key={short}
              className={`tree-progress-dot ${lit ? 'lit' : ''} ${active ? 'active' : ''}`}
              title={labels.stageLabels[stage]}
            >
              <span>{short}</span>
            </div>
          )
        })}
      </div>
      {label && revealStage > 0 && (
        <p className="tree-progress-label">
          <BilingualCrossfadeText
            zh={zhLabels.stageLabels[revealStage]}
            en={enLabels.stageLabels[revealStage]}
            ja={jaLabels.stageLabels[revealStage]}
            activeLocale={locale}
          />
        </p>
      )}
      {revealStage === 0 && (
        <p className="tree-progress-label dim">
          <BilingualCrossfadeText
            zh={zhLabels.idleLabel}
            en={enLabels.idleLabel}
            ja={jaLabels.idleLabel}
            activeLocale={locale}
            intervalMs={4800}
          />
        </p>
      )}
    </div>
  )
}
