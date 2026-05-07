;(() => {
  'use strict'

  let currCard = 0
  let startX = 0
  let currX = 0
  let isDragging = false

  const THRESHOLD = 50

  const wrapper = /** @type {HTMLDivElement} */ (document.querySelector('.cards-wrapper'))
  const cards = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.swipeable-card'))
  const dots = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.nav-dot'))

  /** @param {number} index */
  function goToCard(index) {
    if (index < 0 || index >= cards.length) return
    currCard = index
    updateCards()
    closeTocSidebar()
  }

  function goToNext() {
    goToCard(currCard + 1)
  }

  function goToPrevious() {
    goToCard(currCard - 1)
  }

  function updateCards() {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currCard)
      card.classList.toggle('prev', i < currCard)
    })

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currCard))

    const items = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.toc-item'))
    items.forEach((item, i) => item.classList.toggle('active', i === currCard))
  }

  /** @param {PointerEvent} e */
  function handleStart(e) {
    isDragging = true
    startX = currX = e.clientX
    wrapper.style.cursor = 'grabbing'
  }

  /** @param {PointerEvent} e */
  function handleMove(e) {
    if (!isDragging) return
    currX = e.clientX
  }

  function handleEnd() {
    if (!isDragging) return
    isDragging = false
    wrapper.style.cursor = 'grab'

    const diff = currX - startX
    if (Math.abs(diff) < THRESHOLD) return
    if (diff > 0) goToPrevious()
    else goToNext()
  }

  function closeTocSidebar() {
    document.getElementById('tocSidebar')?.classList.remove('active')
    document.getElementById('tocToggleBtn')?.classList.remove('active')
  }

  function initTocSidebar() {
    const toggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById('tocToggleBtn'))
    const closeBtn = /** @type {HTMLButtonElement} */ (document.getElementById('tocCloseBtn'))
    const sidebar = /** @type {HTMLDivElement} */ (document.getElementById('tocSidebar'))

    if (!toggleBtn || !closeBtn || !sidebar) return

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active')
      toggleBtn.classList.toggle('active')
    })

    closeBtn.addEventListener('click', closeTocSidebar)

    document.addEventListener('click', (e) => {
      const target = /** @type {Node} */ (e.target)
      if (sidebar.classList.contains('active') && !sidebar.contains(target) && !toggleBtn.contains(target)) {
        closeTocSidebar()
      }
    })
  }

  function initSwipeableCards() {
    if (!wrapper || cards.length === 0) return

    // Pointer events cover both mouse and touch
    wrapper.style.cursor = 'grab'
    wrapper.addEventListener('pointerdown', handleStart)
    wrapper.addEventListener('pointermove', handleMove)
    wrapper.addEventListener('pointerup', handleEnd)
    wrapper.addEventListener('pointerleave', handleEnd)

    const prevBtn = /** @type {HTMLButtonElement} */ (document.getElementById('prevCard'))
    const nextBtn = /** @type {HTMLButtonElement} */ (document.getElementById('nextCard'))
    prevBtn.addEventListener('click', goToPrevious)
    nextBtn.addEventListener('click', goToNext)

    dots.forEach((dot, i) => dot.addEventListener('click', () => goToCard(i)))

    const items = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.toc-item'))
    items.forEach((item, i) => item.addEventListener('click', () => goToCard(i)))

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    })

    updateCards()
  }

  function boot() {
    initTocSidebar()
    initSwipeableCards()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
