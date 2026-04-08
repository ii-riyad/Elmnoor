// Wait for DOM to be ready before initializing mobile menu
;(() => {
  'use strict'

  /**
   * Mobile menu functionality
   * @returns {void}
   */
  function initMobileMenu() {
    const mobileMenuBtn = /** @type {HTMLButtonElement} */ (document.getElementById('mobileMenuBtn'))
    const navLinks = /** @type {HTMLDivElement} */ (document.getElementById('navLinks'))

    if (!mobileMenuBtn || !navLinks) return

    let touchHandled = false

    /**
     * Function to toggle menu
     * @returns {void}
     */
    function toggleMenu() {
      const isCurrentlyActive = navLinks.classList.contains('active')
      if (isCurrentlyActive) {
        navLinks.classList.remove('active')
      } else {
        navLinks.classList.add('active')
      }
      const isOpen = navLinks.classList.contains('active')

      const icon = mobileMenuBtn.querySelector('i')
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars')
          icon.classList.add('fa-times')
        } else {
          icon.classList.remove('fa-times')
          icon.classList.add('fa-bars')
        }
      }

      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen))
      const lang = document.documentElement.getAttribute('lang') || 'ar'
      const openLabel =
        lang === 'en'
          ? mobileMenuBtn.dataset.labelOpenEn || mobileMenuBtn.dataset.enAriaLabel || 'Open menu'
          : mobileMenuBtn.dataset.labelOpenAr || mobileMenuBtn.dataset.arAriaLabel || 'فتح القائمة'
      const closeLabel =
        lang === 'en'
          ? mobileMenuBtn.dataset.labelCloseEn || 'Close menu'
          : mobileMenuBtn.dataset.labelCloseAr || mobileMenuBtn.dataset.arAriaLabel || 'إغلاق القائمة'
      mobileMenuBtn.setAttribute('aria-label', isOpen ? closeLabel : openLabel)
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      toggleMenu()
    })

    // Add touch event for better mobile support (with duplicate prevention)
    mobileMenuBtn.addEventListener('touchend', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!touchHandled) {
        touchHandled = true
        toggleMenu()
        setTimeout(() => {
          touchHandled = false
        }, 300)
      }
    })

    // Close mobile menu when clicking on anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        const target = href ? document.querySelector(href) : null
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active')
            const icon = mobileMenuBtn.querySelector('i')
            if (icon) {
              icon.classList.remove('fa-times')
              icon.classList.add('fa-bars')
            }
            mobileMenuBtn.setAttribute('aria-expanded', 'false')
            const lang = document.documentElement.getAttribute('lang') || 'ar'
            const openLabel =
              lang === 'en'
                ? mobileMenuBtn.dataset.labelOpenEn || mobileMenuBtn.dataset.enAriaLabel || 'Open menu'
                : mobileMenuBtn.dataset.labelOpenAr || mobileMenuBtn.dataset.arAriaLabel || 'فتح القائمة'
            mobileMenuBtn.setAttribute('aria-label', openLabel)
          }
        }
      })
    })

    // Close mobile menu when clicking on any nav link
    navLinks.addEventListener('click', (e) => {
      const node = /** @type {HTMLElement} */ (e.target)
      const clickedLink = /** @type {HTMLAnchorElement} */ (node.closest('.nav-link'))
      if (clickedLink) {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active')
          const icon = mobileMenuBtn.querySelector('i')
          if (icon) {
            icon.classList.remove('fa-times')
            icon.classList.add('fa-bars')
          }
          mobileMenuBtn.setAttribute('aria-expanded', 'false')
          const lang = document.documentElement.getAttribute('lang') || 'ar'
          const openLabel =
            lang === 'en'
              ? mobileMenuBtn.dataset.labelOpenEn || mobileMenuBtn.dataset.enAriaLabel || 'Open menu'
              : mobileMenuBtn.dataset.labelOpenAr || mobileMenuBtn.dataset.arAriaLabel || 'فتح القائمة'
          mobileMenuBtn.setAttribute('aria-label', openLabel)
        }
      }
    })

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const node = /** @type {HTMLElement} */ (e.target)
      if (navLinks.classList.contains('active')) {
        if (!navLinks.contains(node) && !mobileMenuBtn.contains(node)) {
          navLinks.classList.remove('active')
          const icon = mobileMenuBtn.querySelector('i')
          if (icon) {
            icon.classList.remove('fa-times')
            icon.classList.add('fa-bars')
          }
          mobileMenuBtn.setAttribute('aria-expanded', 'false')
          const lang = document.documentElement.getAttribute('lang') || 'ar'
          const openLabel =
            lang === 'en'
              ? mobileMenuBtn.dataset.labelOpenEn || mobileMenuBtn.dataset.enAriaLabel || 'Open menu'
              : mobileMenuBtn.dataset.labelOpenAr || mobileMenuBtn.dataset.arAriaLabel || 'فتح القائمة'
          mobileMenuBtn.setAttribute('aria-label', openLabel)
        }
      }
    })
  }

  /**
   * Initialize mobile menu when DOM is ready
   * @returns {void}
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMobileMenu)
    } else {
      initMobileMenu()
    }
  }

  // Start initialization
  init()
})()

// Other initialization
/**
 * Validates an email address
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Set active nav link - wait for DOM
 * @returns {void}
 */
function initNavLinks() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href')
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'))
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavLinks)
} else {
  initNavLinks()
}

document.addEventListener(
  'click',
  (e) => {
    const node = /** @type {HTMLElement} */ (e.target)
    const a = /** @type {HTMLAnchorElement} */ (node.closest('a.visit-btn'))
    if (a && a.href && /^https?:\/\//i.test(a.href)) return
  },
  true
)

// Page Visibility API - Pause animations when page is hidden
;(() => {
  /**
   * @returns {void}
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      document.documentElement.setAttribute('data-visible', 'false')
    } else {
      document.documentElement.setAttribute('data-visible', 'true')
    }
  }

  if (typeof document.hidden !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleVisibilityChange() // Set initial state
  } else {
    // Fallback for older browsers
    document.documentElement.setAttribute('data-visible', 'true')
  }
})()

// Combined Scroll Handlers (Back to Top + Progress Bar) - Optimized
;(() => {
  'use strict'

  let scrollTicking = false
  let lastScrollY = 0

  /**
   * Create Back to Top Button
   * @returns {HTMLButtonElement}
   */
  function createBackToTopButton() {
    const button = document.createElement('button')
    button.className = 'back-to-top'
    button.setAttribute('aria-label', 'الرجوع لأعلى الصفحة')
    button.setAttribute('data-ar-aria-label', 'الرجوع لأعلى الصفحة')
    button.setAttribute('data-en-aria-label', 'Back to top')
    const icon = document.createElement('i')
    icon.className = 'fas fa-arrow-up'
    button.appendChild(icon)
    document.body.appendChild(button)
    return button
  }

  /**
   * @returns {void}
   */
  function initScrollFeatures() {
    const backToTopBtn = /** @type {HTMLButtonElement} */ (
      document.querySelector('.back-to-top') || createBackToTopButton()
    )

    /**
     * Combined scroll handler - runs once per frame
     * @returns {void}
     */
    function handleScroll() {
      const scrollY = window.pageYOffset

      // Back to Top Button
      if (scrollY > 300) {
        backToTopBtn.classList.add('show')
      } else {
        backToTopBtn.classList.remove('show')
      }

      lastScrollY = scrollY
      scrollTicking = false
    }

    // Single scroll listener with throttling
    window.addEventListener(
      'scroll',
      () => {
        if (!scrollTicking) {
          window.requestAnimationFrame(handleScroll)
          scrollTicking = true
        }
      },
      { passive: true }
    )

    // Back to Top click handler
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    /**
     * Update aria-label on language change
     * @returns {void}
     */
    function updateAriaLabel() {
      const lang = /** @type {'ar'|'en'} */ (document.documentElement.getAttribute('lang') || 'ar')
      const label =
        lang === 'en'
          ? backToTopBtn.dataset.enAriaLabel || 'Back to top'
          : backToTopBtn.dataset.arAriaLabel || 'الرجوع لأعلى الصفحة'
      backToTopBtn.setAttribute('aria-label', label)
    }

    document.addEventListener('langchange', updateAriaLabel)
    updateAriaLabel()

    // Initial check
    handleScroll()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFeatures)
  } else {
    initScrollFeatures()
  }
})()

// Scroll Animations (Fade In) - Optimized
;(() => {
  'use strict'

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    // If reduced motion, show all elements immediately
    document.querySelectorAll('.fade-in-section').forEach((el) => {
      el.classList.add('is-visible')
    })
    return
  }

  /**
   * @returns {void}
   */
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section')

    if (sections.length === 0) return

    // Optimized observer - unobserve after animation to reduce work
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          // Unobserve after animation to reduce ongoing work
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      observer.observe(section)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations)
  } else {
    initScrollAnimations()
  }
})()
