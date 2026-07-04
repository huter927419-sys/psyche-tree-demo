import type { BookId } from '../books/types'
import type { Locale } from './locale'
import { localizeChineseCopy } from './traditionalChinese'
import type { CoreProposition, RiteStep, ReturnTreePack, VolumeEntryRite } from './volumeRite'
import {
  getCoreProposition,
  getReturnToTreeRite,
  getVolumeEntryRite,
  getVolumeExitRite,
} from './volumeRite'

export type TrilingualString = {
  zh: string
  en: string
  ja: string
}

export type TrilingualStep = {
  sectionLabel: TrilingualString
  title?: TrilingualString
  paragraphs: TrilingualString[]
  journalPrompt?: TrilingualString
}

export type TrilingualEntryRite = {
  volumeTitle: TrilingualString
  facetLabel: TrilingualString
  steps: TrilingualStep[]
}

export type TrilingualReturnTree = {
  tag: TrilingualString
  title: TrilingualString
  subtitle: TrilingualString
  steps: TrilingualStep[]
  closing: TrilingualString
}

function tri(zh: string, en: string, ja: string): TrilingualString {
  return { zh, en, ja }
}

function alignStep(zh: RiteStep, en: RiteStep, ja: RiteStep): TrilingualStep {
  const len = Math.max(zh.paragraphs.length, en.paragraphs.length, ja.paragraphs.length)
  const paragraphs: TrilingualString[] = []
  for (let i = 0; i < len; i++) {
    paragraphs.push(
      tri(
        zh.paragraphs[i] ?? '',
        en.paragraphs[i] ?? '',
        ja.paragraphs[i] ?? '',
      ),
    )
  }
  return {
    sectionLabel: tri(zh.sectionLabel, en.sectionLabel, ja.sectionLabel),
    title:
      zh.title || en.title || ja.title
        ? tri(zh.title ?? '', en.title ?? '', ja.title ?? '')
        : undefined,
    paragraphs,
    journalPrompt:
      zh.journalPrompt || en.journalPrompt || ja.journalPrompt
        ? tri(
            zh.journalPrompt ?? '',
            en.journalPrompt ?? '',
            ja.journalPrompt ?? '',
          )
        : undefined,
  }
}

function alignSteps(zhSteps: RiteStep[], enSteps: RiteStep[], jaSteps: RiteStep[]): TrilingualStep[] {
  const len = Math.max(zhSteps.length, enSteps.length, jaSteps.length)
  const steps: TrilingualStep[] = []
  for (let i = 0; i < len; i++) {
    steps.push(
      alignStep(
        zhSteps[i] ?? { sectionLabel: '', paragraphs: [] },
        enSteps[i] ?? { sectionLabel: '', paragraphs: [] },
        jaSteps[i] ?? { sectionLabel: '', paragraphs: [] },
      ),
    )
  }
  return steps
}

function entryToTrilingual(zh: VolumeEntryRite, en: VolumeEntryRite, ja: VolumeEntryRite): TrilingualEntryRite {
  return {
    volumeTitle: tri(zh.volumeTitle, en.volumeTitle, ja.volumeTitle),
    facetLabel: tri(zh.facetLabel, en.facetLabel, ja.facetLabel),
    steps: alignSteps(zh.steps, en.steps, ja.steps),
  }
}

function returnTreeToTrilingual(
  zh: ReturnTreePack,
  en: ReturnTreePack,
  ja: ReturnTreePack,
): TrilingualReturnTree {
  return {
    tag: tri(zh.tag, en.tag, ja.tag),
    title: tri(zh.title, en.title, ja.title),
    subtitle: tri(zh.subtitle, en.subtitle, ja.subtitle),
    steps: alignSteps(zh.steps, en.steps, ja.steps),
    closing: tri(zh.closing, en.closing, ja.closing),
  }
}

function propositionToTrilingual(
  zh: CoreProposition,
  en: CoreProposition,
  ja: CoreProposition,
): { main: TrilingualString; sub: TrilingualString } {
  return {
    main: tri(zh.main, en.main, ja.main),
    sub: tri(zh.sub, en.sub, ja.sub),
  }
}

export function getTrilingualEntryRite(bookId: BookId): TrilingualEntryRite {
  return entryToTrilingual(
    getVolumeEntryRite(bookId, 'zh'),
    getVolumeEntryRite(bookId, 'en'),
    getVolumeEntryRite(bookId, 'ja'),
  )
}

export function getTrilingualExitRite(bookId: BookId): TrilingualStep[] {
  return alignSteps(
    getVolumeExitRite(bookId, 'zh'),
    getVolumeExitRite(bookId, 'en'),
    getVolumeExitRite(bookId, 'ja'),
  )
}

export function getTrilingualReturnToTree(): TrilingualReturnTree {
  return returnTreeToTrilingual(
    getReturnToTreeRite('zh'),
    getReturnToTreeRite('en'),
    getReturnToTreeRite('ja'),
  )
}

export function getTrilingualCoreProposition(): {
  main: TrilingualString
  sub: TrilingualString
} {
  return propositionToTrilingual(
    getCoreProposition('zh'),
    getCoreProposition('en'),
    getCoreProposition('ja'),
  )
}

/** Primary line for UI locale; zhTw uses converted simplified zh source. */
export function primaryTrilingualText(locale: Locale, value: TrilingualString): string {
  if (locale === 'en') return value.en
  if (locale === 'ja') return value.ja
  return localizeChineseCopy(locale, value.zh)
}
