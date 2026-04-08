;(() => {
  'use strict'
  const state = { xp: 0, level: 1, xpPerSession: 25, xpPerTask: 5, particlesActive: false }
  const elements = {
    character: document.getElementById('shihabCharacter'),
    characterArea: document.getElementById('characterArea'),
    particlesContainer: document.getElementById('particlesContainer'),
    celebrationOverlay: document.getElementById('celebrationOverlay'),
    progressBar: document.getElementById('progressBar'),
    userLevel: document.getElementById('userLevel'),
    currentXP: document.getElementById('currentXP'),
    nextLevelXP: document.getElementById('nextLevelXP'),
    xpBarFill: document.getElementById('xpBarFill')
  }

  /**
   * @returns {void}
   */
  function loadXP() {
    const saved = localStorage.getItem('shihabXP')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        state.xp = data.xp || 0
        state.level = data.level || 1
      } catch (e) {
        console.error('Error loading XP:', e)
      }
    }
    updateXPDisplay()
  }

  /**
   * @returns {void}
   */
  function saveXP() {
    localStorage.setItem('shihabXP', JSON.stringify({ xp: state.xp, level: state.level }))
  }

  /**
   * @param {number} level
   * @returns {number}
   */
  function calculateXPForLevel(level) {
    return 100 * Math.pow(1.5, level - 1)
  }

  /**
   * @param {number} amount
   * @returns {void}
   */
  function addXP(amount) {
    state.xp += amount
    const xpNeeded = calculateXPForLevel(state.level)
    if (state.xp >= xpNeeded) {
      levelUp()
    } else {
      updateXPDisplay()
    }
    saveXP()
  }

  /**
   * @returns {void}
   */
  function levelUp() {
    state.level++
    state.xp = 0
    updateXPDisplay()
    showCelebration('🎉', 'تهانينا!', `لقد وصلت للمستوى ${state.level}!`)
    if (elements.xpBarFill) {
      elements.xpBarFill.classList.add('level-up')
      setTimeout(() => elements.xpBarFill?.classList.remove('level-up'), 500)
    }
  }

  /**
   * @returns {void}
   */
  function updateXPDisplay() {
    if (!elements.userLevel || !elements.currentXP || !elements.nextLevelXP || !elements.xpBarFill) return
    const xpNeeded = calculateXPForLevel(state.level),
      percentage = (state.xp / xpNeeded) * 100
    elements.userLevel.textContent = state.level.toString()
    elements.currentXP.textContent = Math.floor(state.xp).toString()
    elements.nextLevelXP.textContent = Math.floor(xpNeeded).toString()
    elements.xpBarFill.style.width = percentage + '%'
  }

  /**
   * @returns {void}
   */
  function initCharacterInteractions() {
    if (!elements.character) return
    elements.character.addEventListener('click', () => {
      triggerCharacterReaction('happy')
      showRandomEncouragement()
    })
    elements.character.addEventListener('mouseenter', () => {
      if (!elements.character?.classList.contains('celebrating')) elements.character?.classList.add('encouraging')
    })
    elements.character.addEventListener('mouseleave', () => elements.character?.classList.remove('encouraging'))
  }

  /**
   * @param {string} type
   * @returns {void}
   */
  function triggerCharacterReaction(type) {
    if (!elements.character) return
    elements.character.classList.remove('celebrating', 'happy', 'encouraging')
    setTimeout(() => {
      elements.character?.classList.add(type)
      setTimeout(() => elements.character?.classList.remove(type), 1000)
    }, 10)
  }

  /**
   * @returns {void}
   */
  function showRandomEncouragement() {
    const messages = {
      ar: ['أنت رائع! استمر! 💪', 'أنت تقوم بعمل ممتاز! ⭐', 'أنا فخور بك! 🌟', 'استمر في التركيز! 🎯', 'أنت بطل! 🏆'],
      en: [
        "You're awesome! Keep going! 💪",
        "You're doing great! ⭐",
        "I'm proud of you! 🌟",
        'Stay focused! 🎯',
        "You're a champion! 🏆"
      ]
    }
  }

  /**
   * @returns {void}
   */
  function createParticles(count = 20) {
    if (!elements.particlesContainer || state.particlesActive) return
    state.particlesActive = true
    const colors = ['#fbbf24', '#14b8a6', '#ef4444', '#8b5cf6']
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = '100%'
        particle.style.background = colors[Math.floor(Math.random() * colors.length)]
        particle.style.animationDelay = Math.random() * 0.5 + 's'
        elements.particlesContainer?.appendChild(particle)
        setTimeout(() => particle.remove(), 3000)
      }, i * 50)
    }
    setTimeout(() => (state.particlesActive = false), count * 50 + 3000)
  }

  /**
   * @returns {void}
   */
  function createConfetti() {
    const colors = ['#fbbf24', '#14b8a6', '#ef4444', '#8b5cf6', '#ec4899'],
      confettiCount = 50
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.className = 'confetti'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.width = Math.random() * 10 + 5 + 'px'
        confetti.style.height = Math.random() * 10 + 5 + 'px'
        confetti.style.animationDelay = Math.random() * 0.5 + 's'
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's'
        document.body.appendChild(confetti)
        setTimeout(() => confetti.remove(), 4000)
      }, i * 20)
    }
  }

  /**
   * @param {string} icon
   * @param {string} title
   * @param {string} message
   * @returns {void}
   */
  function showCelebration(icon, title, message) {
    if (!elements.celebrationOverlay) return
    const iconEl = document.getElementById('celebrationIcon'),
      titleEl = document.getElementById('celebrationTitle'),
      messageEl = document.getElementById('celebrationMessage')
    if (iconEl) iconEl.textContent = icon
    if (titleEl) titleEl.textContent = title
    if (messageEl) messageEl.textContent = message
    elements.celebrationOverlay.classList.add('show')
    createConfetti()
    triggerCharacterReaction('celebrating')
  }
  window.closeCelebration = () => {
    if (elements.celebrationOverlay) elements.celebrationOverlay.classList.remove('show')
  }

  /**
   * @param {number} percentage
   * @returns {void}
   */
  function updateProgressBarStyle(percentage) {
    if (!elements.progressBar) return
    elements.progressBar.classList.remove('warning', 'danger')
    if (percentage <= 20) elements.progressBar.classList.add('danger')
    else if (percentage <= 50) elements.progressBar.classList.add('warning')
  }

  /**
   * @returns {void}
   */
  function initTimerIntegration() {
    const originalUpdateTimer = window.studyTimerEnhanced?.updateTimer
    if (window.studyTimerEnhanced) {
      window.studyTimerEnhanced.updateTimer = (time, total) => {
        if (originalUpdateTimer) originalUpdateTimer(time, total)
        const percentage = ((total - time) / total) * 100
        updateProgressBarStyle(percentage)
        if (percentage === 25) {
          triggerCharacterReaction('happy')
        } else if (percentage === 50) {
          triggerCharacterReaction('encouraging')
          createParticles(15)
        } else if (percentage === 75) {
          triggerCharacterReaction('happy')
        } else if (percentage === 90) {
          triggerCharacterReaction('encouraging')
        }
      }
    }
    const originalOnStateChange = window.studyTimerEnhanced?.onStateChange
    if (window.studyTimerEnhanced) {
      window.studyTimerEnhanced.onStateChange = (timerState) => {
        if (originalOnStateChange) originalOnStateChange(timerState)
        if (timerState === 'completed') {
          addXP(state.xpPerSession)
          showCelebration('🎉', 'تهانينا!', 'أكملت الجلسة بنجاح!')
          createConfetti()
          triggerCharacterReaction('celebrating')
        } else if (timerState === 'started') {
          triggerCharacterReaction('happy')
          createParticles(10)
        }
      }
    }
  }
  function initTaskIntegration() {
    const originalToggleTodo = window.studyTools?.toggleTodo
    if (window.studyTools) {
      window.studyTools.toggleTodo = (index) => {
        if (originalToggleTodo) originalToggleTodo(index)
        const todos = JSON.parse(localStorage.getItem('shihabTodos') || '[]')
        if (todos[index] && todos[index].completed) {
          addXP(state.xpPerTask)
          triggerCharacterReaction('happy')
        }
      }
    }
  }

  /**
   * @returns {void}
   */
  function initButtonEffects() {
    document.querySelectorAll('.btn-study').forEach((btn) => {
      btn.addEventListener('click', (/** @type {MouseEvent} */ e) => {
        const ripple = document.createElement('span'),
          rect = this.getBoundingClientRect(),
          size = Math.max(rect.width, rect.height),
          x = e.clientX - rect.left - size / 2,
          y = e.clientY - rect.top - size / 2
        ripple.style.width = ripple.style.height = size + 'px'
        ripple.style.left = x + 'px'
        ripple.style.top = y + 'px'
        ripple.style.position = 'absolute'
        ripple.style.borderRadius = '50%'
        ripple.style.background = 'rgba(255,255,255,0.5)'
        ripple.style.transform = 'scale(0)'
        ripple.style.animation = 'ripple 0.6s ease-out'
        ripple.style.pointerEvents = 'none'
        this.style.position = 'relative'
        this.style.overflow = 'hidden'
        this.appendChild(ripple)
        setTimeout(() => ripple.remove(), 600)
      })
    })
  }
  const style = document.createElement('style')
  style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0;}}'
  document.head.appendChild(style)

  /**
   * @returns {void}
   */
  function init() {
    loadXP()
    initCharacterInteractions()
    initTimerIntegration()
    initTaskIntegration()
    initButtonEffects()
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  window.studyInteractions = { addXP, showCelebration, triggerCharacterReaction, createParticles, createConfetti }
})()
