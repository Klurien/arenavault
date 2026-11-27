// NOVA-0077: dependency-free page meta hook.
// Sets document.title and updates og:title/og:description/og:url on route change.
import { useEffect } from 'react'

let _currentPath = document.location.pathname

export function usePageMeta(meta) {
  // meta = { title, description, ogTitle, ogDescription, ogUrl }
  useEffect(() => {
    // Update document title
    if (meta.title) {
      document.title = meta.title
    }

    // Update og:title meta content
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && meta.ogTitle) ogTitle.setAttribute('content', meta.ogTitle)

    // Update og:description meta content
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && meta.ogDescription) ogDesc.setAttribute('content', meta.ogDescription)

    // Update og:url meta content
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && meta.ogUrl) ogUrl.setAttribute('content', meta.ogUrl)
  }, [meta.title, meta.ogTitle, meta.ogDescription, meta.ogUrl])
}

export default usePageMeta
