;(() => {
  'use strict'

  /**
   * @return {void}
   */
  function loadFA() {
    const link = /** @type {HTMLLinkElement} */ (document.querySelector('link[href*="font-awesome"]'))
    if (!link || !link.sheet) {
      const fa = /** @type {HTMLLinkElement} */ (document.createElement('link'))
      fa.rel = 'stylesheet'
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      fa.crossOrigin = 'anonymous'
      fa.referrerPolicy = 'no-referrer'
      document.head.appendChild(fa)
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(loadFA, 100)
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadFA, 100)
    })
  }
})()
