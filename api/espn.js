export default async function handler(req, res) {
  const { sport, league, type, date } = req.query || {}
  if (!sport || !league || !type) {
    res.status(400).json({ error: 'missing params' })
    return
  }
  if (type !== 'scoreboard' && type !== 'standings') {
    res.status(400).json({ error: 'bad type' })
    return
  }
  const base = type === 'scoreboard'
    ? `https://site.api.espn.com/apis/site/v2/sports/${encodeURIComponent(sport)}/${encodeURIComponent(league)}/scoreboard`
    : `https://site.api.espn.com/apis/v2/sports/${encodeURIComponent(sport)}/${encodeURIComponent(league)}/standings`
  const url = (type === 'scoreboard' && date) ? `${base}?dates=${encodeURIComponent(date)}` : base
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } })
    const data = await r.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    res.status(r.status).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

