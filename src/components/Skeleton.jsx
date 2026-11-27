// Shimmer skeleton loaders — used instead of spinners on Home/Search/Detail so
// the UI feels alive while data streams in. `count` mirrors grid/row layouts.

export function SkeletonCard({ wide = false }) {
  return (
    <div className={`card ${wide ? 'card-wide' : ''} skel-card`} aria-hidden="true">
      <div className="card-poster skel skel-poster" />
      <div className="skel skel-line" style={{ width: '80%' }} />
      <div className="skel skel-line" style={{ width: '50%' }} />
    </div>
  )
}

export function SkeletonGrid({ count = 12, wide = false }) {
  return (
    <div className="grid skel-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} wide={wide} />
      ))}
    </div>
  )
}

export function SkeletonRow({ count = 8 }) {
  return (
    <div className="row skel-row">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="hero skel-hero" aria-hidden="true">
      <div className="skel" />
    </div>
  )
}

/** Netflix-style full-bleed marquee placeholder (NOVA-0058 homepage). */
export function SkeletonMarquee() {
  return (
    <div className="marquee skel-marquee" aria-hidden="true">
      <div className="skel marquee-skel-fill" />
      <div className="marquee-inner">
        <div className="skel marquee-skel-title" />
        <div className="skel marquee-skel-line" style={{ width: '46%' }} />
        <div className="skel marquee-skel-line" style={{ width: '30%' }} />
        <div className="skel marquee-skel-cta" />
      </div>
    </div>
  )
}

export default SkeletonCard
