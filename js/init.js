;(() => {
  'use strict'

  function preloadStylesheets() {
    document
      .querySelectorAll('link[rel="preload"][as="style"]')
      // @ts-expect-error
      .forEach(function (/** @type {HTMLLinkElement} */ link) {
        if (document.readyState === 'loading') {
          link.addEventListener('load', function () {
            this.rel = 'stylesheet'
          })
        } else {
          link.rel = 'stylesheet'
        }
      })
  }

  function initMobileMenu() {
    const mobileMenuBtn = /** @type {HTMLButtonElement} */ (document.getElementById('mobileMenuBtn'))
    const navLinks = /** @type {HTMLDivElement} */ (document.getElementById('navLinks'))

    if (!mobileMenuBtn || !navLinks) return

    const lang = () => document.documentElement.lang || 'ar'
    const label = (/** @type {boolean} */ isOpen) =>
      isOpen ? (lang() === 'en' ? 'Close menu' : 'إغلاق القائمة') : lang() === 'en' ? 'Open menu' : 'فتح القائمة'

    /**
     * @param {boolean} open
     */
    function setMenuState(open) {
      navLinks.classList.toggle('active', open)

      const icon = mobileMenuBtn.querySelector('i')
      if (icon) {
        icon.classList.toggle('fa-bars', !open)
        icon.classList.toggle('fa-xmark', open)
      }

      mobileMenuBtn.setAttribute('aria-expanded', String(open))
      mobileMenuBtn.setAttribute('aria-label', label(open))
    }

    function toggleMenu() {
      setMenuState(!navLinks.classList.contains('active'))
    }

    function closeMenu() {
      setMenuState(false)
    }

    mobileMenuBtn.addEventListener('touchend', (e) => {
      // Prevent the 300ms-delayed synthetic click from also firing
      e.preventDefault()
      toggleMenu()
    })

    // Handles desktop (no touch) and keyboard activation
    mobileMenuBtn.addEventListener('click', (e) => {
      if (e.type === 'click' && navigator.maxTouchPoints === 0) {
        toggleMenu()
      }
    })

    navLinks.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).closest('.nav-link')) closeMenu()
    })
  }

  function highlightCurrNavLink() {
    const currPage = window.location.pathname
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === currPage)
    })
  }

  function initBackToTopBtn() {
    const backToTopBtn = /** @type {HTMLButtonElement} */ (document.querySelector('.back-to-top'))
    let ticking = false

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            backToTopBtn.classList.toggle('show', window.pageYOffset > 300)
            ticking = false
          })
          ticking = true
        }
      },
      { passive: true }
    )

    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

    // Initial state
    backToTopBtn.classList.toggle('show', window.pageYOffset > 300)
  }

  function initVisibilityUpdate() {
    function update() {
      document.documentElement.setAttribute('data-visible', document.hidden ? 'false' : 'true')
    }
    document.addEventListener('visibilitychange', update)
    update()
  }

  function boot() {
    preloadStylesheets()
    initMobileMenu()
    initBackToTopBtn()
    initVisibilityUpdate()
    highlightCurrNavLink()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
