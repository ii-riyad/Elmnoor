;(() => {
  'use strict'

  const trackingId = 'G-4J70S0ZD47'

  // @ts-expect-error
  window.dataLayer = window.dataLayer || []

  function gtag() {
    // @ts-expect-error
    window.dataLayer.push(arguments)
  }

  // @ts-expect-error
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', trackingId)

  // @ts-expect-error
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (/** @type {HTMLLinkElement} */ link) {
    if (document.readyState === 'loading') {
      link.addEventListener('load', function () {
        this.rel = 'stylesheet'
      })
    } else {
      link.rel = 'stylesheet'
    }
  })
})()
