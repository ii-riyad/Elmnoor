;(() => {
  'use strict'

  const handle = /** @type {HTMLButtonElement} */ (document.getElementById('mmuPricingHandle'))
  const drawer = /** @type {HTMLDivElement} */ (document.getElementById('mmuPricingDrawer'))
  const overlay = /** @type {HTMLDivElement} */ (document.getElementById('mmuPricingOverlay'))

  if (!handle || !drawer || !overlay) return

  function openDrawer() {
    drawer.classList.add('open')
    overlay.classList.add('show')
    handle.setAttribute('aria-expanded', 'true')
    drawer.setAttribute('aria-hidden', 'false')
  }

  function closeDrawer() {
    drawer.classList.remove('open')
    overlay.classList.remove('show')
    handle.setAttribute('aria-expanded', 'false')
    drawer.setAttribute('aria-hidden', 'true')
  }

  handle.addEventListener('click', openDrawer)
  overlay.addEventListener('click', closeDrawer)

  const closeBtn = /** @type {HTMLButtonElement} */ (document.getElementById('mmuPricingClose'))
  closeBtn?.addEventListener('click', closeDrawer)
})()
