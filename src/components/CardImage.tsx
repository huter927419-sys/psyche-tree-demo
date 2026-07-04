interface CardImageProps {
  pattern: string
  className?: string
}

export function CardImage({ pattern, className = '' }: CardImageProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#050505] ${className}`}>
      <img
        src={`/cards/${pattern}.png?v=3`}
        alt=""
        className="w-full h-full object-cover block"
        loading="lazy"
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-30"
        style={{
          background:
            'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }}
        aria-hidden
      />
    </div>
  )
}
