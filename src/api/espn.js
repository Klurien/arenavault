// ESPN hidden API client. Free, CORS-enabled, no key.
// https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/...

export const LEAGUES = [
  { id: 'premier-league', sport: 'soccer', league: 'eng.1', name: 'Premier League', country: 'England' },
  { id: 'la-liga', sport: 'soccer', league: 'esp.1', name: 'La Liga', country: 'Spain' },
  { id: 'serie-a', sport: 'soccer', league: 'ita.1', name: 'Serie A', country: 'Italy' },
  { id: 'bundesliga', sport: 'soccer', league: 'ger.1', name: 'Bundesliga', country: 'Germany' },
  { id: 'ligue-1', sport: 'soccer', league: 'fra.1', name: 'Ligue 1', country: 'France' },
  { id: 'champions-league', sport: 'soccer', league: 'uefa.champions', name: 'Champions League', country: 'Europe' },
  { id: 'mls', sport: 'soccer', league: 'usa.1', name: 'MLS', country: 'USA' },
  { id: 'nba', sport: 'basketball', league: 'nba', name: 'NBA', country: 'USA' },
  { id: 'nfl', sport: 'football', league: 'nfl', name: 'NFL', country: 'USA' },
  { id: 'nhl', sport: 'hockey', league: 'nhl', name: 'NHL', country: 'USA/Canada' },
  { id: 'mlb', sport: 'baseball', league: 'mlb', name: 'MLB', country: 'USA' },
]

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports'

export async function fetchScoreboard(sport, league, date) {
  // date: YYYYMMDD (optional)
  const params = new URLSearchParams({ sport, league, type: 'scoreboard' })
  if (date) params.set('date', date)
  const url = `/api/espn?${params.toString()}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`ESPN ${res.status}`)
    const data = await res.json()
    const events = data.events || []
    return events.map((e) => {
      const comp = (e.competitions || [])[0] || {}
      const competitors = comp.competitors || []
      const home = competitors.find((c) => c.homeAway === 'home') || competitors[0] || {}
      const away = competitors.find((c) => c.homeAway === 'away') || competitors[1] || {}
      return {
        id: e.id,
        name: e.name,
        shortName: e.shortName,
        date: e.date,
        status: e.status?.type?.name || 'STATUS_SCHEDULED',
        statusDetail: e.status?.type?.detail || '',
        clock: e.status?.displayClock || '',
        period: e.status?.period || 0,
        home: {
          name: home.team?.displayName || home.team?.name || 'Home',
          short: home.team?.abbreviation || '',
          logo: home.team?.logo || '',
          score: home.score || '0',
          winner: !!home.winner,
        },
        away: {
          name: away.team?.displayName || away.team?.name || 'Away',
          short: away.team?.abbreviation || '',
          logo: away.team?.logo || '',
          score: away.score || '0',
          winner: !!away.winner,
        },
        venue: comp.venue?.fullName || '',
        broadcasts: (comp.broadcasts || []).map((b) => b.names || []).flat(),
      }
    })
  } catch (err) {
    console.error('fetchScoreboard', err)
    return []
  }
}

export async function fetchStandings(sport, league) {
  const params = new URLSearchParams({ sport, league, type: 'standings' })
  const url = `/api/espn?${params.toString()}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`ESPN ${res.status}`)
    const data = await res.json()
    // standings can be under data.standings.entries or data.children[0].standings.entries
    let entries = []
    if (data.standings?.entries) entries = data.standings.entries
    else if (Array.isArray(data.children)) {
      for (const c of data.children) {
        if (c.standings?.entries) { entries = c.standings.entries; break }
      }
    }
    return entries.map((e) => {
      const stats = {}
      for (const s of e.stats || []) stats[s.name] = s.value ?? s.displayValue
      return {
        team: e.team?.displayName || e.team?.name || '',
        short: e.team?.abbreviation || '',
        logo: e.team?.logos?.[0]?.href || e.team?.logo || '',
        rank: stats.rank ?? stats.playoffSeed ?? '',
        played: stats.gamesPlayed ?? stats.GP ?? '',
        won: stats.wins ?? stats.W ?? '',
        drawn: stats.ties ?? stats.D ?? '',
        lost: stats.losses ?? stats.L ?? '',
        points: stats.points ?? stats.PTS ?? '',
        gf: stats.pointsFor ?? stats.GF ?? '',
        ga: stats.pointsAgainst ?? stats.GA ?? '',
        gd: stats.pointDifferential ?? stats.GD ?? '',
      }
    })
  } catch (err) {
    console.error('fetchStandings', err)
    return []
  }
}

export async function fetchNews(sport, league) {
  const url = `${ESPN_BASE}/${sport}/${league}/news?limit=10`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`ESPN ${res.status}`)
    const data = await res.json()
    return (data.articles || []).map((a) => ({
      id: a.id,
      headline: a.headline,
      description: a.description,
      published: a.published,
      link: a.links?.web?.href || '',
      image: a.images?.[0]?.url || '',
    }))
  } catch (err) {
    console.error('fetchNews', err)
    return []
  }
}

export function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export function isLive(status) {
  return status === 'STATUS_IN_PROGRESS' || status === 'inprogress'
}

export function isFinished(status) {
  return status === 'STATUS_FINAL' || status === 'finished'
}
