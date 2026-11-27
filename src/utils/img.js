// Image helpers. TMDB images are served straight from image.tmdb.org (CORS-open,
// globally cached); proxyImg is kept as the single call-site indirection so a
// proxy can be dropped in later without touching components.
export function proxyImg(url) {
  return url || ''
}

export const tmdbImg = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : ''

export default proxyImg
