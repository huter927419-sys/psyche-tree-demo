import type { BookDefinition } from '../types'
import { getBook } from '../registry'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'

/** Visual stub for closed-cover rendering — not a playable volume. */
export function getGuideCoverBook(locale: Locale): BookDefinition {
  const ui = getUi(locale)
  const template = getBook('psyche-tree', locale)
  return {
    ...template,
    meta: {
      ...template.meta,
      coverTitle: ui.guideCoverTitle,
      coverSubtitle: ui.guideCoverSubtitle,
      coverTagline: ui.guideCoverTagline,
      coverHint: ui.guideCoverHint,
      shelfTitle: ui.guideCoverSubtitle,
      spineLabel: ui.guideCoverTitle,
      domainLabel: ui.guideCoverSubtitle,
      integrationLabel: ui.guideCoverTagline,
    },
  }
}
