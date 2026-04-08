;(function () {
  'use strict'

  class SwipeableCards {
    constructor() {
      this.currentCard = 0
      this.startX = 0
      this.currentX = 0
      this.isDragging = false
      this.threshold = 50
      this.cards = document.querySelectorAll('.swipeable-card')
      this.totalCards = this.cards.length
      this.wrapper = document.querySelector('.cards-wrapper')
      this.dots = document.querySelectorAll('.nav-dot')
      this.prevBtn = document.getElementById('prevCard')
      this.nextBtn = document.getElementById('nextCard')

      if (!this.wrapper || this.totalCards === 0) return
      this.init()
    }

    init() {
      this.wrapper.addEventListener('touchstart', (e) => this.handleStart(e), false)
      this.wrapper.addEventListener('touchmove', (e) => this.handleMove(e), false)
      this.wrapper.addEventListener('touchend', (e) => this.handleEnd(e), false)

      this.wrapper.addEventListener('mousedown', (e) => this.handleStart(e), false)
      this.wrapper.addEventListener('mousemove', (e) => this.handleMove(e), false)
      this.wrapper.addEventListener('mouseup', (e) => this.handleEnd(e), false)
      this.wrapper.addEventListener('mouseleave', (e) => this.handleEnd(e), false)

      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.goToPrevious())
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.goToNext())

      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToCard(index))
      })

      this.updateCards()
    }

    handleStart(e) {
      this.isDragging = true
      this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
      this.currentX = this.startX
      this.wrapper.style.cursor = 'grabbing'
    }

    handleMove(e) {
      if (!this.isDragging) return
      this.currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
    }

    handleEnd() {
      if (!this.isDragging) return
      this.isDragging = false
      this.wrapper.style.cursor = 'grab'

      const diff = this.currentX - this.startX
      if (Math.abs(diff) <= this.threshold) return

      if (diff > 0) this.goToPrevious()
      else this.goToNext()
    }

    goToNext() {
      if (this.currentCard < this.totalCards - 1) {
        this.currentCard++
        this.updateCards()
      }
    }

    goToPrevious() {
      if (this.currentCard > 0) {
        this.currentCard--
        this.updateCards()
      }
    }

    goToCard(index) {
      if (index < 0 || index >= this.totalCards) return
      this.currentCard = index
      this.updateCards()

      const sidebar = document.getElementById('tocSidebar')
      const toggleBtn = document.getElementById('tocToggleBtn')
      if (sidebar) sidebar.classList.remove('active')
      if (toggleBtn) toggleBtn.classList.remove('active')

      const cardsSection = document.getElementById('cards-section')
      if (cardsSection) {
        const offset = 100
        const elementPosition = cardsSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }

    updateCards() {
      this.cards.forEach((card, index) => {
        card.classList.remove('active', 'prev')
        if (index === this.currentCard) {
          card.classList.add('active')
          setTimeout(() => {
            card.scrollTop = 0
          }, 100)
        } else if (index < this.currentCard) {
          card.classList.add('prev')
        }
      })

      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentCard)
      })

      document.querySelectorAll('.toc-item').forEach((item, index) => {
        item.classList.toggle('active', index === this.currentCard)
      })
    }
  }

  function initTocSidebar() {
    const tocToggleBtn = document.getElementById('tocToggleBtn')
    const tocCloseBtn = document.getElementById('tocCloseBtn')
    const tocSidebar = document.getElementById('tocSidebar')

    if (!tocToggleBtn || !tocCloseBtn || !tocSidebar) return

    tocToggleBtn.addEventListener('click', () => {
      tocSidebar.classList.toggle('active')
      tocToggleBtn.classList.toggle('active')
    })

    tocCloseBtn.addEventListener('click', () => {
      tocSidebar.classList.remove('active')
      tocToggleBtn.classList.remove('active')
    })

    document.addEventListener('click', (e) => {
      if (!tocSidebar.contains(e.target) && !tocToggleBtn.contains(e.target)) {
        tocSidebar.classList.remove('active')
        tocToggleBtn.classList.remove('active')
      }
    })
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }

  function boot() {
    initTocSidebar()
    const instance = new SwipeableCards()
    window.scrollToCard = function (cardIndex) {
      if (instance && typeof instance.goToCard === 'function') {
        instance.goToCard(cardIndex)
      }
    }
    initSmoothAnchors()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
