;(() => {
  'use strict'

  const handle = document.getElementById('mmuPricingHandle')
  const drawer = document.getElementById('mmuPricingDrawer')
  const overlay = document.getElementById('mmuPricingOverlay')
  const closeBtn = document.getElementById('mmuPricingClose')
  const content = document.getElementById('mmuPricingContent')

  /**
   * @returns {void}
   */
  function openDrawer() {
    if (!drawer || !overlay || !handle) return
    drawer.classList.add('open')
    overlay.classList.add('show')
    handle.setAttribute('aria-expanded', 'true')
    drawer.setAttribute('aria-hidden', 'false')
  }

  /**
   * @returns {void}
   */
  function closeDrawer() {
    if (!drawer || !overlay || !handle) return
    drawer.classList.remove('open')
    overlay.classList.remove('show')
    handle.setAttribute('aria-expanded', 'false')
    drawer.setAttribute('aria-hidden', 'true')
  }

  if (handle) handle.addEventListener('click', openDrawer)
  if (overlay) overlay.addEventListener('click', closeDrawer)
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer)

  let startX = null
  let opened = false

  if (handle) {
    handle.addEventListener('pointerdown', (e) => {
      startX = e.clientX
      opened = false
      handle.setPointerCapture(e.pointerId)
    })

    handle.addEventListener('pointermove', (e) => {
      if (startX !== null && !opened) {
        const dx = e.clientX - startX
        if (dx > 40) {
          openDrawer()
          opened = true
        }
      }
    })

    handle.addEventListener('pointerup', () => {
      startX = null
      opened = false
    })
  }

  const note = document.querySelector('.pricing-note')
  const accordion = document.querySelector('.pricing-accordion')
  if (content && accordion) {
    if (note) content.appendChild(note)
    content.appendChild(accordion)
  }
})()
