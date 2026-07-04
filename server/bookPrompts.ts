export function buildMysticalPromptForBook(
  bookId: string,
  psychologyInput: string,
  locale: 'zh' | 'en' = 'zh',
): string {
  if (locale === 'en') {
    if (bookId === 'emotional-flow') {
      return emotionalFlowPromptTemplateEn.replace('[PSYCHOLOGY]', psychologyInput)
    }
    return psycheTreePromptTemplateEn.replace('[PSYCHOLOGY]', psychologyInput)
  }

  const template =
    bookId === 'emotional-flow'
      ? emotionalFlowPromptTemplate
      : psycheTreePromptTemplate
  return template.replace('[PSYCHOLOGY]', psychologyInput)
}

export const psycheTreePromptTemplate = `你是一位深谙生命象征与内在智慧的玄学解读者。
请根据以下心理学底层画像，用庄严而诗意的语言进行玄学解读。
使用生命之树、河流、星光、丝线、山峰等象征元素。
语气神圣而温柔，像古老的智慧在低语。
不要直接说"你的选择是XX"，而是描述当前生命能量的状态与流动。
请用中文撰写。
心理学画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`

export const psycheTreePromptTemplateEn = `You are a reader of life symbol and inner wisdom.
Based on the psychological profile below, write a sacred poetic interpretation in English.
Use the tree of life, river, starlight, thread, and mountain.
Tone gentle and timeless. Do not say "your choice was X"; describe energy and flow.
Psychological profile:
[PSYCHOLOGY]
Write one coherent interpretation in English.`

export const emotionalFlowPromptTemplate = `你是一位擅长意象与象征的心理学写作者。
请根据以下心理学情感画像，用温柔而诗意的语言进行整合性描述。
可使用河流、星光、丝线、雾、光等象征元素，但避免预言或命运论断。
重点描述当前情感状态的多维面向，以及可能的自我关照方向。
不要直接说"你的选择是XX"，而是描述情感状态与内在体验。
请用中文撰写。
心理学情感画像：
[PSYCHOLOGY]
请生成一段连贯的情感整合描述。`

export const emotionalFlowPromptTemplateEn = `You are a psychology writer skilled in image and symbol.
Based on the emotional profile below, write an integrated description in gentle poetic English.
Use river, starlight, thread, mist, and light—avoid prophecy or fate.
Describe multidimensional emotional state and self-care directions.
Do not say "your choice was X"; describe state and inner experience.
Emotional profile:
[PSYCHOLOGY]
Write one coherent integrated description in English.`
