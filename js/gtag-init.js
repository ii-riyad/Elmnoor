;(() => {
  'use strict'

  const trackingId = 'G-4J70S0ZD47'

  window.dataLayer = window.dataLayer || []

  function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', trackingId)
})()
