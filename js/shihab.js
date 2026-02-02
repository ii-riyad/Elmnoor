;(function () {
  'use strict'
  const state = {
    isRunning: false,
    isPaused: false,
    isBreak: false,
    currentTime: 0,
    totalTime: 25 * 60,
    breakTime: 5 * 60,
    interval: null,
    messageIndex: 0,
    lastMessageTime: 0,
    sessionsToday: 0,
    minutesToday: 0,
    goal: '',
    prayerReminder: false
  }
  const elements = {
    character: document.getElementById('shihabCharacter'),
    speechBubble: document.getElementById('speechBubble'),
    speechText: document.getElementById('speechText'),
    timerDisplay: document.getElementById('timerDisplay'),
    progressBar: document.getElementById('progressBar'),
    timerLabel: document.getElementById('timerLabel'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
    sessionDuration: document.getElementById('sessionDuration'),
    breakDuration: document.getElementById('breakDuration'),
    goalInput: document.getElementById('goalInput'),
    prayerReminder: document.getElementById('prayerReminder'),
    sessionsToday: document.getElementById('sessionsToday'),
    minutesToday: document.getElementById('minutesToday'),
    presetBtns: document.querySelectorAll('.preset-btn')
  }
  const messages = {
    ar: {
      welcome: [
        'مرحباً! أنا شِهاب، مرشدك الدراسي. ابدأ جلسة دراسة وكن معك!',
        'هيا بنا! ابدأ جلسة جديدة وكن معك خطوة بخطوة.',
        'جاهز للدراسة؟ ابدأ الآن!'
      ],
      start: [
        'ممتاز! بدأنا الجلسة. ركز وكن معك! 💪',
        'رائع! ابدأ بتركيز. أنا هنا لدعمك!',
        'حظاً موفقاً! دعنا ننجز هذا معاً!'
      ],
      middle: ['أنت بخير! استمر في التركيز. 💪', 'رائع! أنت تقوم بعمل ممتاز!', 'استمر! أنت في منتصف الطريق تقريباً!'],
      almostDone: ['بقيت دقائق قليلة! استمر! ⏰', 'أنت قريب من النهاية! لا تستسلم!', 'آخر دقائق! احفظ عملك وسلّمه!'],
      break: [
        'حان وقت الاستراحة! قف، تمدد، خذ نفساً عميقاً. ☕',
        'استراحة مستحقة! تحرك قليلاً واشرب ماء.',
        'وقت الاستراحة! استرخ قليلاً ثم نعود.'
      ],
      prayer: ['⏰ حان وقت الصلاة! توقف بلطف وصلّ ثم عد.', 'وقت الصلاة! خذ استراحة للصلاة.', 'تذكير: حان وقت الصلاة.'],
      noStart: ['لماذا لم تبدأ بعد؟ هيا، ابدأ الآن! 😤', 'لا تتردد! ابدأ الجلسة الآن.', 'ماذا تنتظر؟ ابدأ الدراسة!'],
      completed: ['ممتاز! أكملت الجلسة بنجاح! 🎉', 'رائع! أنت بطل! جلسة مكتملة.', 'تهانينا! جلسة ناجحة!']
    },
    en: {
      welcome: [
        "Hello! I'm Shihab, your study guide. Start a study session and I'll be with you!",
        "Let's go! Start a new session and I'll be with you step by step.",
        'Ready to study? Start now!'
      ],
      start: [
        "Excellent! We started the session. Focus and I'm with you! 💪",
        "Great! Start focusing. I'm here to support you!",
        "Good luck! Let's get this done together!"
      ],
      middle: [
        "You're doing great! Keep focusing. 💪",
        "Awesome! You're doing excellent work!",
        "Keep going! You're almost halfway there!"
      ],
      almostDone: [
        'Just a few minutes left! Keep going! ⏰',
        "You're close to the end! Don't give up!",
        'Last minutes! Save your work and submit!'
      ],
      break: [
        'Break time! Stand up, stretch, take a deep breath. ☕',
        'Well-deserved break! Move a bit and drink water.',
        "Break time! Relax a bit then we'll continue."
      ],
      prayer: [
        '⏰ Prayer time! Pause gently, pray, then return.',
        'Prayer time! Take a break for prayer.',
        "Reminder: It's prayer time."
      ],
      noStart: [
        "Why haven't you started yet? Come on, start now! 😤",
        "Don't hesitate! Start the session now.",
        'What are you waiting for? Start studying!'
      ],
      completed: [
        'Excellent! You completed the session successfully! 🎉',
        "Awesome! You're a champion! Session completed.",
        'Congratulations! Successful session!'
      ]
    }
  }
  function setCharacterState(s) {
    if (elements.character) elements.character.className = 'shihab-character ' + s
  }
  function moveCharacter() {}
  function showMessage(category, force = false) {
    const lang = document.documentElement.getAttribute('lang') || 'ar',
      langMessages = messages[lang] || messages.ar,
      categoryMessages = langMessages[category] || []
    if (categoryMessages.length === 0) return
    const now = Date.now()
    if (!force && now - state.lastMessageTime < 3000) return
    const randomMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
    if (elements.speechText) {
      elements.speechText.textContent = randomMessage
      elements.speechText.setAttribute('data-ar', randomMessage)
      elements.speechText.setAttribute('data-en', randomMessage)
    }
    if (elements.speechBubble) elements.speechBubble.classList.add('show')
    state.lastMessageTime = now
    setTimeout(() => {
      if (elements.speechBubble) elements.speechBubble.classList.remove('show')
    }, 5000)
    if (Math.random() > 0.7) setTimeout(moveCharacter, 1000)
  }
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60),
      secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  function updateTimer() {
    if (elements.timerDisplay) elements.timerDisplay.textContent = formatTime(state.currentTime)
    const total = state.isBreak ? state.breakTime : state.totalTime,
      percentage = ((total - state.currentTime) / total) * 100
    if (elements.progressBar) elements.progressBar.style.width = percentage + '%'
    const lang = document.documentElement.getAttribute('lang') || 'ar'
    if (elements.timerLabel) {
      if (state.isBreak) {
        elements.timerLabel.textContent = lang === 'en' ? 'Break Time' : 'وقت الاستراحة'
        elements.timerLabel.setAttribute('data-ar', 'وقت الاستراحة')
        elements.timerLabel.setAttribute('data-en', 'Break Time')
      } else {
        elements.timerLabel.textContent = lang === 'en' ? 'Study Session' : 'جلسة دراسة'
        elements.timerLabel.setAttribute('data-ar', 'جلسة دراسة')
        elements.timerLabel.setAttribute('data-en', 'Study Session')
      }
    }
  }
  function tick() {
    if (!state.isRunning || state.isPaused) return
    state.currentTime--
    if (state.currentTime <= 0) {
      completeSession()
      return
    }
    updateTimer()
    const total = state.isBreak ? state.breakTime : state.totalTime,
      remaining = state.currentTime,
      percentage = (remaining / total) * 100
    if (percentage > 45 && percentage < 55 && remaining % 60 === 0) {
      showMessage('middle')
      setCharacterState('happy')
      setTimeout(() => setCharacterState('idle'), 1000)
    }
    if (remaining <= 120 && remaining > 60 && remaining % 30 === 0) showMessage('almostDone')
    if (remaining === 60) {
      showMessage('almostDone', true)
      setCharacterState('happy')
    }
  }
  function completeSession() {
    clearInterval(state.interval)
    state.isRunning = false
    state.isPaused = false
    if (state.isBreak) {
      startStudySession()
    } else {
      state.sessionsToday++
      const minutes = Math.floor(state.totalTime / 60)
      state.minutesToday += minutes
      updateStats()
      saveStats()
      showMessage('completed', true)
      setCharacterState('happy')
      setTimeout(() => {
        setCharacterState('idle')
        startBreak()
      }, 3000)
    }
    updateButtons()
  }
  function startStudySession() {
    state.isBreak = false
    state.currentTime = state.totalTime
    state.isRunning = true
    state.isPaused = false
    updateTimer()
    updateButtons()
    showMessage('start', true)
    setCharacterState('happy')
    setTimeout(() => setCharacterState('idle'), 1000)
    state.interval = setInterval(tick, 1000)
  }
  function startBreak() {
    state.isBreak = true
    state.currentTime = state.breakTime
    state.isRunning = true
    state.isPaused = false
    updateTimer()
    updateButtons()
    showMessage('break', true)
    state.interval = setInterval(tick, 1000)
  }
  function updateButtons() {
    if (!elements.startBtn || !elements.pauseBtn || !elements.stopBtn) return
    if (state.isRunning && !state.isPaused) {
      elements.startBtn.style.display = 'none'
      elements.pauseBtn.style.display = 'block'
      elements.stopBtn.style.display = 'block'
    } else if (state.isPaused) {
      elements.startBtn.style.display = 'block'
      elements.pauseBtn.style.display = 'none'
      elements.stopBtn.style.display = 'block'
    } else {
      elements.startBtn.style.display = 'block'
      elements.pauseBtn.style.display = 'none'
      elements.stopBtn.style.display = 'none'
    }
  }
  if (elements.startBtn) {
    elements.startBtn.addEventListener('click', () => {
      if (state.isPaused) {
        state.isPaused = false
        state.isRunning = true
        state.interval = setInterval(tick, 1000)
        updateButtons()
        showMessage('start')
      } else {
        state.totalTime = parseInt(elements.sessionDuration?.value || 25) * 60
        state.breakTime = parseInt(elements.breakDuration?.value || 5) * 60
        state.goal = elements.goalInput?.value || ''
        saveSettings()
        startStudySession()
      }
    })
  }
  if (elements.pauseBtn) {
    elements.pauseBtn.addEventListener('click', () => {
      state.isPaused = true
      clearInterval(state.interval)
      updateButtons()
      showMessage('break')
    })
  }
  if (elements.stopBtn) {
    elements.stopBtn.addEventListener('click', () => {
      clearInterval(state.interval)
      state.isRunning = false
      state.isPaused = false
      state.currentTime = state.isBreak ? state.breakTime : state.totalTime
      updateTimer()
      updateButtons()
      setCharacterState('idle')
      if (elements.speechBubble) elements.speechBubble.classList.remove('show')
    })
  }
  elements.presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.duration) {
        if (elements.sessionDuration) elements.sessionDuration.value = btn.dataset.duration
        elements.presetBtns.forEach((b) => {
          if (b.dataset.duration) b.classList.toggle('active', b === btn)
        })
      }
      if (btn.dataset.break) {
        if (elements.breakDuration) elements.breakDuration.value = btn.dataset.break
        elements.presetBtns.forEach((b) => {
          if (b.dataset.break) b.classList.toggle('active', b === btn)
        })
      }
      saveSettings()
    })
  })
  if (elements.sessionDuration) {
    elements.sessionDuration.addEventListener('change', () => {
      if (!state.isRunning) {
        state.totalTime = parseInt(elements.sessionDuration.value) * 60
        state.currentTime = state.totalTime
        updateTimer()
      }
      saveSettings()
    })
  }
  if (elements.breakDuration) {
    elements.breakDuration.addEventListener('change', () => {
      state.breakTime = parseInt(elements.breakDuration.value) * 60
      saveSettings()
    })
  }
  if (elements.goalInput) {
    elements.goalInput.addEventListener('change', () => {
      state.goal = elements.goalInput.value
      saveSettings()
    })
  }
  if (elements.prayerReminder) {
    elements.prayerReminder.addEventListener('change', () => {
      state.prayerReminder = elements.prayerReminder.checked
      saveSettings()
    })
  }
  function updateStats() {
    if (elements.sessionsToday) elements.sessionsToday.textContent = state.sessionsToday
    if (elements.minutesToday) elements.minutesToday.textContent = state.minutesToday
  }
  function loadStats() {
    const saved = localStorage.getItem('shihabStats')
    if (saved) {
      try {
        const stats = JSON.parse(saved),
          today = new Date().toDateString()
        if (stats.date === today) {
          state.sessionsToday = stats.sessions || 0
          state.minutesToday = stats.minutes || 0
        } else {
          state.sessionsToday = 0
          state.minutesToday = 0
        }
      } catch (e) {
        console.error('Error loading stats:', e)
      }
    }
    updateStats()
  }
  function saveStats() {
    const stats = { date: new Date().toDateString(), sessions: state.sessionsToday, minutes: state.minutesToday }
    localStorage.setItem('shihabStats', JSON.stringify(stats))
  }
  function loadSettings() {
    const saved = localStorage.getItem('shihabSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (elements.sessionDuration) elements.sessionDuration.value = settings.duration || 25
        if (elements.breakDuration) elements.breakDuration.value = settings.break || 5
        if (elements.goalInput) elements.goalInput.value = settings.goal || ''
        if (elements.prayerReminder) elements.prayerReminder.checked = settings.prayer || false
        state.totalTime = (settings.duration || 25) * 60
        state.breakTime = (settings.break || 5) * 60
        state.goal = settings.goal || ''
        state.prayerReminder = settings.prayer || false
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
    state.currentTime = state.totalTime
    updateTimer()
    updateButtons()
  }
  function saveSettings() {
    const settings = {
      duration: parseInt(elements.sessionDuration?.value || 25),
      break: parseInt(elements.breakDuration?.value || 5),
      goal: elements.goalInput?.value || '',
      prayer: elements.prayerReminder?.checked || false
    }
    localStorage.setItem('shihabSettings', JSON.stringify(settings))
  }
  function checkPrayerTime() {
    if (!state.prayerReminder || state.isBreak) return
    const now = new Date(),
      hours = now.getHours(),
      minutes = now.getMinutes(),
      prayerTimes = [
        { name: 'Fajr', hour: 5, minute: 30 },
        { name: 'Dhuhr', hour: 12, minute: 30 },
        { name: 'Asr', hour: 15, minute: 30 },
        { name: 'Maghrib', hour: 18, minute: 0 },
        { name: 'Isha', hour: 19, minute: 30 }
      ]
    for (const prayer of prayerTimes) {
      if (hours === prayer.hour && minutes === prayer.minute) {
        showMessage('prayer', true)
        if (state.isRunning && !state.isPaused && elements.pauseBtn) elements.pauseBtn.click()
        break
      }
    }
  }
  setInterval(checkPrayerTime, 60000)
  let idleTimer = null
  function resetIdleTimer() {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      if (!state.isRunning) {
        showMessage('noStart')
        setCharacterState('angry')
        setTimeout(() => setCharacterState('idle'), 2000)
      }
    }, 30000)
  }
  function init() {
    loadSettings()
    loadStats()
    updateButtons()
    showMessage('welcome', true)
    setCharacterState('idle')
    state.currentTime = state.totalTime
    updateTimer()
    document.addEventListener('click', resetIdleTimer)
    document.addEventListener('keypress', resetIdleTimer)
    resetIdleTimer()
    setInterval(() => {
      if (!state.isRunning && Math.random() > 0.7) moveCharacter()
    }, 10000)
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  const observer = new MutationObserver(() => {
    if (state.isRunning) {
      const lang = document.documentElement.getAttribute('lang') || 'ar',
        category = state.isBreak ? 'break' : 'start'
      showMessage(category)
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] })
})()
