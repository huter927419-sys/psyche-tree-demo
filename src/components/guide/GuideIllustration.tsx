import { guideIllustrationSrc } from '../../books/guide/illustrations'

interface GuideIllustrationProps {
  id: string
}

export function GuideIllustration({ id }: GuideIllustrationProps) {
  return (
    <figure className="guide-spread-illustration">
      <img
        src={guideIllustrationSrc(id)}
        alt=""
        className="guide-spread-illustration-img"
        loading="lazy"
        draggable={false}
      />
      <div className="guide-spread-illustration-veil" aria-hidden />
    </figure>
  )
}
