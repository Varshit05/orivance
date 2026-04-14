import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to top on navigation, except when opening /services with a hash
 * (home service cards) so the Services page can scroll to the target section.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const isServiceDeepLink =
      pathname === '/services' && hash.length > 1
    if (isServiceDeepLink) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
