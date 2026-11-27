// EmbedSportex API client. Free, CORS-enabled, no key.
// https://api.esportex.site/api/streams

const BASE = 'https://api.esportex.site/api/streams'

const SPORT_LABELS = {
  football: 'Football',
  basketball: 'Basketball',
  amfootball: 'American Football',
  volleyball: 'Volleyball',
  badminton: 'Badminton',
  race: 'Racing',
  tennis: 'Tennis',
  baseball: 'Baseball',
  fight: 'Combat',
  hockey: 'Hockey',
  rugby: 'Rugby',
  cricket: 'Cricket',
  other: 'Other',
}

export const SPORT_LABEL = (k) => SPORT_LABELS[k] || k

// EmbedSportex kickoff strings are in WIB (UTC+7): "YYYY-MM-DD HH:mm"
export function parseKickoff(str) {
  if (!str) return null
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/)
  if (!m) return null
  const [, y, mo, d, h, mi] = m
  // WIB = UTC+7
  const utc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h) - 7, Number(mi))
  return new Date(utc)
}

let cache = { at: 0, data: null }
const TTL = 60 * 1000

export async function fetchStreams(force = false) {
  if (!force && cache.data && Date.now() - cache.at < TTL) return cache.data
  try {
    const res = await fetch(BASE, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`EmbedSportex ${res.status}`)
    const json = await res.json()
    const sports = Object.keys(json).filter((k) => Array.isArray(json[k]))
    const matches = []
    for (const sport of sports) {
      for (const m of json[sport]) {
        matches.push({
          sport,
          sportLabel: SPORT_LABEL(sport),
          slug: m.slug,
          title: m.tag || 'Match',
          kickoff: m.kickoff,
          kickoffDate: parseKickoff(m.kickoff),
          endTime: m.endTime,
          poster: m.poster,
          league: m.league,
          iframes: Array.isArray(m.iframes) ? m.iframes : [],
        })
      }
    }
    cache = { at: Date.now(), data: matches }
    return matches
  } catch (err) {
    console.error('fetchStreams', err)
    return cache.data || []
  }
}

export function liveNow(matches) {
  const now = Date.now()
  return matches.filter((m) => {
    const s = m.kickoffDate?.getTime()
    const e = m.endTime ? parseKickoff(m.endTime)?.getTime() : null
    if (!s) return false
    if (s > now) return false
    if (e && e < now) return false
    return true
  })
}

export function upcoming(matches) {
  const now = Date.now()
  return matches.filter((m) => {
    const s = m.kickoffDate?.getTime()
    if (!s) return false
    return s > now
  })
}

export function ended(matches) {
  const now = Date.now()
  return matches.filter((m) => {
    const e = m.endTime ? parseKickoff(m.endTime)?.getTime() : null
    if (!e) return false
    return e < now
  })
}

export function findBySlug(matches, slug) {
  return matches.find((m) => m.slug === slug) || null
}

export function groupBySport(matches) {
  const g = {}
  for (const m of matches) {
    if (!g[m.sport]) g[m.sport] = []
    g[m.sport].push(m)
  }
  return g
}
