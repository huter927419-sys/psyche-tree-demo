interface BookCoverProps {
  onOpen: () => void
  opening?: boolean
}

export function BookCover({ onOpen, opening = false }: BookCoverProps) {
  return (
    <div className="book-scene flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <p className="text-[10px] tracking-[0.45em] uppercase text-[rgba(212,175,122,0.5)] mb-8">
        Psyche · Book of Life
      </p>

      <div className="book-perspective mb-10">
        <div className={`book-closed ${opening ? 'book-closed-opening' : ''}`}>
          <div className="book-cover-spine-side" aria-hidden />
          <div className="book-cover-face">
            <div className="book-cover-texture" aria-hidden />
            <div className="book-cover-ornament top" aria-hidden />
            <h1
              className="font-serif text-3xl md:text-4xl text-[#f5f0e8] text-center leading-snug mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              生命之书
            </h1>
            <p
              className="font-serif text-lg md:text-xl text-[rgba(245,240,232,0.65)] text-center mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              心象生命之树探索
            </p>
            <div className="book-cover-divider" aria-hidden />
            <p className="text-xs text-[rgba(200,200,200,0.45)] text-center tracking-widest mt-6">
              黑白生命之树 · 七维内观
            </p>
            <div className="book-cover-ornament bottom" aria-hidden />
          </div>
          <div className="book-cover-pages-edge" aria-hidden />
        </div>
        <div className="book-shadow-plate cover" aria-hidden />
      </div>

      <p className="max-w-sm text-center text-sm text-[rgba(245,240,232,0.6)] leading-relaxed mb-3">
        这是一次与自己的温柔对话。
      </p>
      <p className="max-w-md text-center text-xs text-[rgba(200,200,200,0.4)] leading-relaxed mb-10">
        每一页是一道向内的问题；每一次翻页，生命之树在身后逐层展开。
      </p>

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        className="book-nav-btn book-nav-btn-primary px-12 disabled:opacity-50"
      >
        {opening ? '正在揭开…' : '揭开书页'}
      </button>
    </div>
  )
}
