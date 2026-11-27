# StreamVault — Movie & TV Streaming (Rebranded Cinejoy-style UI)

A full-featured movie/TV streaming discovery site built with Vite + React + Tailwind.
Uses TMDB for metadata and multiple free embed providers for playback.

## Features
- Home: trending, popular, top-rated, now playing, upcoming, popular TV
- Browse Movies / TV Shows with pagination
- Top 10 & New releases
- Search (movies, TV, people)
- Detail pages with cast, similar titles, where-to-watch providers
- Watch page with multi-provider player + season/episode picker for TV
- My List + Continue Watching (localStorage)
- Person pages
- Genre browsing
- Responsive dark UI, PWA-ready

## Setup
```bash
npm install
cp .env.example .env
# optionally set VITE_TMDB_API_KEY (free at themoviedb.org). A public demo key is bundled.
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Data source
- Metadata: TMDB (free, attribution required)
- Streaming: third-party embed providers (vidsrc, bingeapi, 2embed, vidfast, vidlink, superembed)

## Notes
StreamVault does not host any media files. All playback is sourced from third-party providers.