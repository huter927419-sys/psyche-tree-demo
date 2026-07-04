/** Japanese card copy keyed by image pattern (shared art). */
export const CARD_LEXICON_JA: Record<
  string,
  { label: string; description: string }
> = {
  'steady-river': {
    label: '静かな川',
    description: '内なる流れは、静かで澄んだリズムを保っている。',
  },
  'wind-leaf': {
    label: '風に揺れる葉',
    description: '微風に揺れ、瞬間の風向きに方向を変える。',
  },
  'mountain-guard': {
    label: '山の守り手',
    description: 'まず地を守り、それから明確な一歩を踏み出す。',
  },
  'star-explorer': {
    label: '星の探索者',
    description: '小さな試みが、今響く道を映し出す。',
  },
  'deep-root-tree': {
    label: '深根の樹',
    description: '暗土に根を下ろし——源は穏やかで静か。',
  },
  'fog-path': {
    label: '霧の道',
    description: '道は現れては消える；それでも内へ歩み続ける。',
  },
  'star-guide': {
    label: '星の導き',
    description: 'かすかな星明かりが、次の一歩を示す。',
  },
  'drift-boat': {
    label: '漂う舟',
    description: '今は停泊している；源はまだ深みに待つ。',
  },
  'warm-hands': {
    label: '温かい両手',
    description: '自分の岸を保ちながら、温もりを近づける。',
  },
  'shield': {
    label: '守護の盾',
    description: '風が過ぎ去るまで、盾を閉じて心を守る。',
  },
  'silk-bridge': {
    label: '絹の橋',
    description: '安全を感じたら、ゆっくりと開いていく。',
  },
  'stars-gaze': {
    label: '遠き星',
    description: '距離を保つ温もり——近さと余白が共にある。',
  },
  'balance-boat': {
    label: '均衡の舟',
    description: '中流で中心を保ち、エネルギーは流れの中に留まる。',
  },
  'cautious-mountain': {
    label: '慎重な山',
    description: '高所を保ち、動く前に守る。',
  },
  'flexible-wind': {
    label: '柔らかな風',
    description: '瞬間に合わせて移ろう——軽やかな時も、根を失う時も。',
  },
  'sensing-river': {
    label: '感知する川',
    description: 'まず流れを感じ、それから自然に調整する。',
  },
  'still-lake': {
    label: '静湖',
    description: '波紋を見てから、それに応える。',
  },
  'soft-candle': {
    label: '柔らかな燭',
    description: '穏やかな光で、自分自身に温もりを返す。',
  },
  'guardian-tree': {
    label: '守護の樹',
    description: '幹は穏やか——内なる心を守る。',
  },
  'wind-leaf-emotion': {
    label: '風に揺れる葉',
    description: '波が鏡より先に来る；静けさはゆっくり戻る。',
  },
  'bloom-tree': {
    label: '花開く樹',
    description: '変化が土となり、枝は光へ伸びる。',
  },
  'stable-mountain': {
    label: '不動の山',
    description: '山の如く立つ——選ぶまで動かない。',
  },
  'wind-cloud': {
    label: '風に漂う雲',
    description: '気配は雲影の如く漂う——それでも地を探している。',
  },
  'seed-awakening': {
    label: '目覚める種',
    description: '地下で源が揺れる——まだ芽を出している。',
  },
  'resonance-light': {
    label: '共鳴の光',
    description: '大切なものは明るく輝く；行動はそれに応える。',
  },
  'seeking-lamp': {
    label: '求む灯',
    description: '小さな灯を携え、真実はゆっくり集まる。',
  },
  'steady-path': {
    label: '穏やかな道',
    description: '光に従って歩む——忍耐強く、根を保ちながら。',
  },
  'fog-walk': {
    label: '霧の中を歩む',
    description: '鏡は曇っていても、内へ歩き続ける。',
  },
  'gushing-spring': {
    label: '湧き出る泉',
    description: '感情は穏やかで使える力と共に湧き上がる。',
  },
  'wind-ripple': {
    label: '風紋',
    description: '表面が揺れる——まだその形を探している。',
  },
  'torrent-river': {
    label: '激流',
    description: '流れは強い——すぐには静まらない。',
  },
}

export function japaneseCard(
  pattern: string,
  fallbackLabel: string,
  fallbackDescription: string,
) {
  const entry = CARD_LEXICON_JA[pattern]
  return {
    label: entry?.label ?? fallbackLabel,
    description: entry?.description ?? fallbackDescription,
  }
}
