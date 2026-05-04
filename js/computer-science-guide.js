;(() => {
  'use strict'

  let currentCard = 0
  const totalCards = 5

  /**
   * @return {void}
   */
  function updateDots() {
    const dots = document.querySelectorAll('.navigation-dots .dot')
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentCard)
    })
  }

  /**
   * @return {void}
   */
  function updateTOC() {
    const tocItems = document.querySelectorAll('.toc-item')
    tocItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentCard)
    })
  }

  /**
   * @param {number} index
   * @return {void}
   */
  function scrollToCard(index) {
    if (index < 0 || index >= totalCards) return

    const cards = document.querySelectorAll('.swipeable-card')
    cards.forEach((card) => card.classList.remove('active'))

    const targetCard = document.querySelector(`[data-card="${index}"]`)
    if (targetCard) {
      targetCard.classList.add('active')
      currentCard = index
      updateDots()
      updateTOC()

      const cardsSection = document.getElementById('cards-section')
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  window.scrollToCard = scrollToCard

  document.querySelectorAll('.toc-item').forEach((item, index) => {
    item.addEventListener('click', () => scrollToCard(index))
  })

  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.addEventListener('click', () => scrollToCard(index))
  })

  document.getElementById('navLeft')?.addEventListener('click', () => {
    scrollToCard(currentCard - 1)
  })

  document.getElementById('navRight')?.addEventListener('click', () => {
    scrollToCard(currentCard + 1)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollToCard(currentCard + 1)
    if (e.key === 'ArrowRight') scrollToCard(currentCard - 1)
  })

  let touchStartX = 0
  let touchEndX = 0

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    if (touchEndX < touchStartX - 50) scrollToCard(currentCard - 1)
    if (touchEndX > touchStartX + 50) scrollToCard(currentCard + 1)
  })

  const tocToggleBtn = document.getElementById('tocToggleBtn')
  const tocSidebar = document.getElementById('tocSidebar')
  const tocCloseBtn = document.getElementById('tocCloseBtn')

  tocToggleBtn?.addEventListener('click', () => {
    tocSidebar?.classList.add('active')
  })

  tocCloseBtn?.addEventListener('click', () => {
    tocSidebar?.classList.remove('active')
  })

  document.addEventListener('click', (e) => {
    const node = /** @type {Node} */ (e.target)
    if (tocSidebar?.classList.contains('active') && !tocSidebar.contains(node) && !tocToggleBtn?.contains(node)) {
      tocSidebar.classList.remove('active')
    }
  })
})()
