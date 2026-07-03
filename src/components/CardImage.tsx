import { useState } from 'react'

interface CardImageProps {
  pattern: string
  className?: string
}

export function CardImage({ pattern, className = '' }: CardImageProps) {
  const [src, setSrc] = useState(`/cards/${pattern}.png`)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (!failed) {
      setFailed(true)
      setSrc(`/cards/${pattern}.svg`)
    }
  }

  return (
    <img
      src={src}
      alt=""
      className={`w-full h-full object-cover block ${className}`}
      loading="lazy"
      draggable={false}
      onError={handleError}
    />
  )
}
