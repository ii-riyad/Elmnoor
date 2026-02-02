;(function () {
  'use strict'
  const elements = {
    timerDisplay: document.getElementById('timerDisplay'),
    timerLabel: document.getElementById('timerLabel'),
    timerCircle: document.getElementById('timerCircle'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
    sessionDuration: document.getElementById('sessionDuration'),
    breakDuration: document.getElementById('breakDuration'),
    character: document.getElementById('shihabCharacter'),
    characterArea: document.getElementById('characterArea'),
    speechBubble: document.getElementById('speechBubble'),
    speechText: document.getElementById('speechText')
  }
  const CIRCUMFERENCE = 2 * Math.PI * 45
  let currentTime = 25 * 60,
    totalTime = 25 * 60,
    isRunning = false,
    isPaused = false,
    timerInterval = null
  function getTimerState() {
    return { isRunning: isRunning, isPaused: isPaused, currentTime: currentTime, totalTime: totalTime }
  }
  function initCircularTimer() {
    if (!elements.timerCircle) return
    elements.timerCircle.style.strokeDasharray = CIRCUMFERENCE
    updateCircularProgress()
  }
  function updateCircularProgress() {
    if (!elements.timerCircle) return
    const percentage = (currentTime / totalTime) * 100
    const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE
    elements.timerCircle.style.strokeDashoffset = offset
    elements.timerCircle.classList.remove('warning', 'danger')
    if (percentage <= 20) elements.timerCircle.classList.add('danger')
    else if (percentage <= 50) elements.timerCircle.classList.add('warning')
  }
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60),
      secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  function updateDisplay() {
    if (elements.timerDisplay) elements.timerDisplay.textContent = formatTime(currentTime)
    updateCircularProgress()
    updateCharacterState()
  }
  function updateCharacterState() {
    if (!elements.character) return
    const percentage = (currentTime / totalTime) * 100
    elements.character.classList.remove('celebrating', 'happy', 'encouraging')
    if (percentage > 75) elements.character.classList.add('happy')
    else if (percentage > 50) elements.character.classList.add('encouraging')
    else if (percentage > 25) elements.character.classList.add('happy')
    else elements.character.classList.add('encouraging')
  }
  function tick() {
    if (!isRunning || isPaused) return
    currentTime--
    if (currentTime <= 0) {
      completeSession()
      return
    }
    updateDisplay()
    const percentage = ((totalTime - currentTime) / totalTime) * 100
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 90) showMilestone(percentage)
    const remainingMinutes = Math.ceil(currentTime / 60)
    if (remainingMinutes <= 2 && remainingMinutes > 0 && currentTime % 60 === 0) {
      showAlmostDoneMessage()
    }
  }
  function showAlmostDoneMessage() {
    const speechBubble = document.getElementById('speechBubble'),
      speechText = document.getElementById('speechText')
    if (!speechBubble || !speechText) return
    const lang = document.documentElement.getAttribute('lang') || 'ar'
    const messages = {
      ar: ['بقي دقائق قليلة! استمر! ⏰', 'أنت قريب من النهاية! لا تستسلم! 🏁', 'آخر دقائق! احفظ عملك وسلّمه! 💪'],
      en: [
        'Just a few minutes left! Keep going! ⏰',
        "You're close to the end! Don't give up! 🏁",
        'Last minutes! Save your work and submit! 💪'
      ]
    }
    const msg = messages[lang] || messages.ar
    const randomMsg = msg[Math.floor(Math.random() * msg.length)]
    speechText.textContent = randomMsg
    speechBubble.classList.add('show')
    setTimeout(() => speechBubble.classList.remove('show'), 5000)
  }
  function startTimer() {
    if (isRunning && !isPaused) return
    if (timerInterval) clearInterval(timerInterval)
    if (isPaused) {
      isPaused = false
    } else {
      totalTime = parseInt(elements.sessionDuration?.value || 25) * 60
      currentTime = totalTime
    }
    isRunning = true
    updateButtons()
    updateDisplay()
    timerInterval = setInterval(tick, 1000)
    if (window.studyInteractions) {
      window.studyInteractions.triggerCharacterReaction('happy')
      window.studyInteractions.createParticles(15)
    }
  }
  function pauseTimer() {
    if (!isRunning) return
    isPaused = true
    isRunning = false
    clearInterval(timerInterval)
    timerInterval = null
    updateButtons()
  }
  function stopTimer() {
    isRunning = false
    isPaused = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    totalTime = parseInt(elements.sessionDuration?.value || 25) * 60
    currentTime = totalTime
    if (elements.timerLabel) {
      const lang = document.documentElement.getAttribute('lang') || 'ar'
      elements.timerLabel.textContent = lang === 'en' ? 'Study Session' : 'جلسة دراسة'
    }
    updateButtons()
    updateDisplay()
  }
  function completeSession() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    isRunning = false
    isPaused = false
    if (window.studyInteractions) {
      window.studyInteractions.showCelebration('🎉', 'تهانينا!', 'أكملت الجلسة بنجاح!')
      window.studyInteractions.addXP(25)
      window.studyInteractions.createConfetti()
      window.studyInteractions.triggerCharacterReaction('celebrating')
    }
    updateStats()
    updateButtons()
    setTimeout(() => {
      if (!isRunning && !isPaused) startBreak()
    }, 3000)
  }
  function startBreak() {
    if (timerInterval) clearInterval(timerInterval)
    totalTime = parseInt(elements.breakDuration?.value || 5) * 60
    currentTime = totalTime
    isRunning = true
    isPaused = false
    if (elements.timerLabel) {
      const lang = document.documentElement.getAttribute('lang') || 'ar'
      elements.timerLabel.textContent = lang === 'en' ? 'Break Time' : 'وقت الاستراحة'
    }
    updateButtons()
    updateDisplay()
    timerInterval = setInterval(() => {
      if (!isRunning || isPaused) return
      currentTime--
      if (currentTime <= 0) {
        clearInterval(timerInterval)
        timerInterval = null
        if (elements.timerLabel) {
          const lang = document.documentElement.getAttribute('lang') || 'ar'
          elements.timerLabel.textContent = lang === 'en' ? 'Study Session' : 'جلسة دراسة'
        }
        totalTime = parseInt(elements.sessionDuration?.value || 25) * 60
        currentTime = totalTime
        isRunning = true
        isPaused = false
        updateButtons()
        updateDisplay()
        timerInterval = setInterval(tick, 1000)
        return
      }
      updateDisplay()
    }, 1000)
  }
  function showMilestone(percentage) {
    const messages = {
      25: { icon: '🎯', msg: '25% مكتمل!', sub: 'استمر في التركيز!' },
      50: { icon: '💪', msg: 'نصف الطريق!', sub: 'أنت تقوم بعمل رائع!' },
      75: { icon: '⭐', msg: '75% مكتمل!', sub: 'أنت قريب من النهاية!' },
      90: { icon: '🏁', msg: 'آخر 10%!', sub: 'أنت على وشك الإنجاز!' }
    }
    const msg = messages[percentage]
    if (msg && window.studyInteractions) {
      window.studyInteractions.triggerCharacterReaction('happy')
      if (percentage === 50) window.studyInteractions.createParticles(20)
    }
  }
  function updateButtons() {
    if (elements.startBtn) elements.startBtn.style.display = isRunning && !isPaused ? 'none' : 'block'
    if (elements.pauseBtn) elements.pauseBtn.style.display = isRunning && !isPaused ? 'block' : 'none'
    if (elements.stopBtn) elements.stopBtn.style.display = isRunning ? 'block' : 'none'
  }
  function updateStats() {
    const sessionsEl = document.getElementById('sessionsToday'),
      minutesEl = document.getElementById('minutesToday')
    if (sessionsEl && minutesEl) {
      let sessions = parseInt(sessionsEl.textContent) || 0,
        minutes = parseInt(minutesEl.textContent) || 0
      sessions++
      minutes += Math.floor(totalTime / 60)
      sessionsEl.textContent = sessions
      minutesEl.textContent = minutes
      localStorage.setItem('shihabStats', JSON.stringify({ sessions, minutes, date: new Date().toDateString() }))
    }
  }
  function loadStats() {
    const saved = localStorage.getItem('shihabStats')
    if (saved) {
      try {
        const stats = JSON.parse(saved),
          today = new Date().toDateString()
        if (stats.date === today) {
          const sessionsEl = document.getElementById('sessionsToday'),
            minutesEl = document.getElementById('minutesToday')
          if (sessionsEl) sessionsEl.textContent = stats.sessions || 0
          if (minutesEl) minutesEl.textContent = stats.minutes || 0
        }
      } catch (e) {
        console.error('Error loading stats:', e)
      }
    }
  }
  function initCharacterInteractions() {
    if (elements.character) {
      elements.character.addEventListener('click', () => {
        if (window.studyInteractions) {
          window.studyInteractions.triggerCharacterReaction('happy')
          window.studyInteractions.showRandomEncouragement()
        }
      })
    }
    if (elements.characterArea) {
      elements.characterArea.addEventListener('click', (e) => {
        if (e.target === elements.characterArea || e.target.closest('.character-interactive-area'))
          if (window.studyInteractions) window.studyInteractions.createParticles(10)
      })
    }
  }
  function init() {
    initCircularTimer()
    updateDisplay()
    updateButtons()
    loadStats()
    initCharacterInteractions()
    if (elements.startBtn) elements.startBtn.addEventListener('click', startTimer)
    if (elements.pauseBtn) elements.pauseBtn.addEventListener('click', pauseTimer)
    if (elements.stopBtn) elements.stopBtn.addEventListener('click', stopTimer)
    document.querySelectorAll('.preset-btn[data-duration]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (elements.sessionDuration) {
          elements.sessionDuration.value = btn.dataset.duration
          document
            .querySelectorAll('.preset-btn[data-duration]')
            .forEach((b) => b.classList.toggle('active', b === btn))
          if (!isRunning) {
            totalTime = parseInt(btn.dataset.duration) * 60
            currentTime = totalTime
            updateDisplay()
          }
        }
      })
    })
    document.querySelectorAll('.preset-btn[data-break]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (elements.breakDuration) {
          elements.breakDuration.value = btn.dataset.break
          document.querySelectorAll('.preset-btn[data-break]').forEach((b) => b.classList.toggle('active', b === btn))
        }
      })
    })
    document.querySelectorAll('.tool-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab
        document.querySelectorAll('.tool-tab').forEach((t) => t.classList.toggle('active', t === tab))
        document
          .querySelectorAll('.tool-content')
          .forEach((content) => content.classList.toggle('active', content.id === `${tabName}Content`))
      })
    })
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  window.studyTimerEnhanced = {
    start: startTimer,
    pause: pauseTimer,
    stop: stopTimer,
    updateDisplay: updateDisplay,
    isRunning: () => isRunning,
    isPaused: () => isPaused,
    getState: getTimerState
  }
})()
