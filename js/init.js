;(() => {
  'use strict'

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
