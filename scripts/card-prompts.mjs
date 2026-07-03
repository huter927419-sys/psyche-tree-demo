/** Shared card metadata + AI image prompts for generation scripts */

export const CARD_STYLE_PREFIX = `Sacred monochrome mystical illustration for a psychology meditation card.
Strictly black and white with subtle silver line art on deep black background (#0a0a0a).
A faint sacred tree silhouette visible in the background behind the main subject.
Minimal gold accent points only. Fine ink or charcoal drawing style, elegant, serene, photorealistic lighting.
Smooth clean gradients, soft natural glow — absolutely NO film grain, NO noise, NO texture overlay, NO halftone dots.
No text, no letters, no watermark, no border frame. Centered composition, high contrast, crisp edges.
Aspect ratio landscape 2:1.`

export const CARDS = [
  {
    pattern: 'steady-river',
    label: '稳流之河',
    description: '安静而清晰的河流，柔和光点，从左下向右上流动',
  },
  {
    pattern: 'wind-leaf',
    label: '随风之叶',
    description: '一片叶子在风中轻轻旋转，周围柔和风纹',
  },
  {
    pattern: 'mountain-guard',
    label: '山中守者',
    description: '简洁山峰轮廓，基座稳固，山顶微光',
  },
  {
    pattern: 'star-explorer',
    label: '星光探索者',
    description: '几颗小星星连成路径，下面有小路延伸',
  },
  {
    pattern: 'deep-root-tree',
    label: '根深之树',
    description: '树根系深入地下，枝叶向上伸展',
  },
  {
    pattern: 'fog-path',
    label: '雾中之径',
    description: '小路在雾气中延伸，远处有微光',
  },
  {
    pattern: 'star-guide',
    label: '星河指引',
    description: '星光连成指引的线条',
  },
  {
    pattern: 'drift-boat',
    label: '随缘之舟',
    description: '小舟在水面上漂流',
  },
  {
    pattern: 'warm-hands',
    label: '温暖之手',
    description: '两只手轻轻相触，带柔和光晕',
  },
  {
    pattern: 'shield',
    label: '守护之盾',
    description: '简洁盾牌轮廓，中间有保护空间',
  },
  {
    pattern: 'silk-bridge',
    label: '柔丝之桥',
    description: '细丝或轻桥连接两侧',
  },
  {
    pattern: 'stars-gaze',
    label: '星河相望',
    description: '两颗星星之间有柔和光线连接',
  },
  {
    pattern: 'balance-boat',
    label: '平衡之舟',
    description: '小舟在水面上保持平衡',
  },
  {
    pattern: 'cautious-mountain',
    label: '谨慎之山',
    description: '稳固山峰，基座宽厚',
  },
  {
    pattern: 'flexible-wind',
    label: '灵活之风',
    description: '风吹动叶子或云朵',
  },
  {
    pattern: 'sensing-river',
    label: '感知之河',
    description: '河流自然流动，带感知光晕',
  },
  {
    pattern: 'still-lake',
    label: '静湖之镜',
    description: '平静湖面倒映星空',
  },
  {
    pattern: 'soft-candle',
    label: '柔光之烛',
    description: '一支蜡烛点亮微光',
  },
  {
    pattern: 'guardian-tree',
    label: '守护之树',
    description: '树木守护核心，环形光晕',
  },
  {
    pattern: 'wind-leaf-emotion',
    label: '风中之叶',
    description: '叶子在风中摇曳，多片叶影',
  },
  {
    pattern: 'bloom-tree',
    label: '绽放之树',
    description: '树木在变化中伸展枝叶，带花环光点',
  },
  {
    pattern: 'stable-mountain',
    label: '稳固之山',
    description: '山峰稳固，地平线清晰',
  },
  {
    pattern: 'wind-cloud',
    label: '风中之云',
    description: '云朵随风流动',
  },
  {
    pattern: 'seed-awakening',
    label: '种子觉醒者',
    description: '种子破土而出发芽',
  },
  {
    pattern: 'resonance-light',
    label: '共振之光',
    description: '光点与路径共振连接',
  },
  {
    pattern: 'seeking-lamp',
    label: '寻找之灯',
    description: '一盏灯在暗夜中发光',
  },
  {
    pattern: 'steady-path',
    label: '稳行之径',
    description: '稳固小路延伸向前，带光点',
  },
  {
    pattern: 'fog-walk',
    label: '雾中之行',
    description: '人在雾中行走，远处有光',
  },
]

export function buildCardPrompt(card) {
  return `${CARD_STYLE_PREFIX}\n\nSubject: 「${card.label}」— ${card.description}.`
}
