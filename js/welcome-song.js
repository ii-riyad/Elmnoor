;(() => {
  'use strict'

  const STORAGE_KEY = 'elmnoor_song_played'
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('welcomeSong'))
  const toggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById('songToggleBtn'))

  if (!(audio instanceof HTMLAudioElement) || !(toggleBtn instanceof HTMLButtonElement)) {
    return
  }

  const icon = toggleBtn.querySelector('i')
  const text = toggleBtn.querySelector('.replay-text')

  /**
   * @returns {boolean}
   */
  function hasSongBeenPlayed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  }

  /**
   * @returns {void}
   */
  function markSongAsPlayed() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Ignore storage failures
    }
  }

  /**
   * @param {boolean} isPlaying
   * @returns {void}
   */
  function updateButtonUI(isPlaying) {
    if (!(icon instanceof HTMLElement) || !(text instanceof HTMLElement)) {
      return
    }

    if (isPlaying) {
      icon.className = 'fas fa-pause'
      text.textContent = document.documentElement.lang === 'en' ? 'Pause' : 'إيقاف'
      text.setAttribute('data-ar', 'إيقاف')
      text.setAttribute('data-en', 'Pause')
      toggleBtn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Pause song' : 'إيقاف الأغنية')
      toggleBtn.classList.add('playing')
    } else {
      icon.className = 'fas fa-music'
      text.textContent = document.documentElement.lang === 'en' ? 'Play' : 'تشغيل'
      text.setAttribute('data-ar', 'تشغيل')
      text.setAttribute('data-en', 'Play')
      toggleBtn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Play song' : 'تشغيل الأغنية')
      toggleBtn.classList.remove('playing')
    }
  }

  /**
   * @returns {Promise<void>}
   */
  function playSong() {
    audio.volume = 0.7
    audio.muted = false

    return audio.play().then(() => updateButtonUI(true))
  }

  /**
   * @returns {void}
   */
  function pauseSong() {
    audio.pause()
    updateButtonUI(false)
  }

  /**
   * @returns {void}
   */
  function togglePlayPause() {
    if (audio.paused) {
      playSong().catch(() => {
        updateButtonUI(false)
      })
    } else {
      pauseSong()
    }
  }

  /**
   * @returns {void}
   */
  function initFirstVisitAutoPlay() {
    if (hasSongBeenPlayed()) {
      return
    }

    const playFirstVisit = () => {
      if (hasSongBeenPlayed()) {
        return
      }

      playSong()
        .then(() => {
          markSongAsPlayed()
        })
        .catch(() => {
          // Browser blocked autoplay; we'll retry on first interaction.
        })
    }

    const playOnFirstInteraction = () => {
      if (hasSongBeenPlayed()) {
        return
      }

      playSong()
        .then(() => {
          markSongAsPlayed()
        })
        .catch(() => {
          // Ignore if user still blocks playback.
        })
    }

    if (document.readyState === 'complete') {
      setTimeout(playFirstVisit, 500)
    } else {
      window.addEventListener('load', () => setTimeout(playFirstVisit, 500), { once: true })
    }

    document.addEventListener('click', playOnFirstInteraction, { once: true, capture: true })
    document.addEventListener('touchstart', playOnFirstInteraction, { once: true, capture: true })
    document.addEventListener('keydown', playOnFirstInteraction, { once: true, capture: true })
  }

  /**
   * @returns {void}
   */
  function init() {
    updateButtonUI(false)

    initFirstVisitAutoPlay()

    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault()
      togglePlayPause()
    })

    audio.addEventListener('play', () => updateButtonUI(true))
    audio.addEventListener('pause', () => updateButtonUI(false))
    audio.addEventListener('ended', () => updateButtonUI(false))
    audio.addEventListener('error', () => updateButtonUI(false))
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
