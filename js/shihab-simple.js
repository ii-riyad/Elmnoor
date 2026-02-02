// Shihab Simple Auto Movement - Lightweight
;(function () {
  'use strict'

  const character = {
    element: null,
    image: null,
    speechBubble: null,
    speechText: null,
    currentPosition: 100,
    direction: 1, // 1 = right, -1 = left
    isMoving: true,
    moveInterval: null
  }

  // Tailored messages per action (Arabic + English)
  const messages = {
    ar: {
      welcome: 'مرحباً! أنا شِهاب، مرشدك الدراسي.',
      timerStart: 'لنبدأ! ركّز لمدة قصيرة ثم خذ استراحة.',
      timerPause: 'استراحة قصيرة — اشرب ماءً وتحرّك قليلاً.',
      timerReset: 'أُعيد الضبط. جاهز لجولة جديدة؟',
      timerMid: 'نصف الطريق! استمر، تقوم بعمل رائع.',
      timerNearEnd: 'بقي القليل — أكمل بقوة!',
      timerComplete: 'أحسنت! أكملت الجلسة بنجاح. 🎉',
      timerPreset: 'تم تغيير مدة الجلسة.',

      gpaOpen: 'حاسبة المعدل مفتوحة — أضف موادك بدقة.',
      gpaClose: 'أغلقت الحاسبة — راجع النتائج عند الحاجة.',
      gpaAddCourse: 'أُضيفت مادة — لا تنسَ الساعات والدرجة.',
      gpaDeleteCourse: 'حُذفت مادة — تحقق من النتيجة بعد التعديل.',

      tabTodo: 'قائمة المهام — قسّم عملك إلى خطوات صغيرة.',
      tabNotes: 'دوِّن ملاحظاتك — الأفكار الجيدة لا تنتظر.',
      tabFlash: 'بطاقات المذاكرة — اسأل ثم أجب.',
      tabSounds: 'اختر صوتاً يساعدك على التركيز.',

      flashAdd: 'أُضيفت بطاقة — اجعل السؤال واضحاً والجواب موجزاً.',
      flashStart: 'بدأت المذاكرة — اقلب البطاقة بعد التفكير.',
      flashNext: 'بطاقة جديدة — اختبر نفسك بثقة.',
      flashPrev: 'رجوع للبطاقة السابقة — راجع بسرعة.',
      flashReset: 'حُذفت البطاقات — ابدأ مجموعة جديدة منظمة.',
      flashEdit: 'تعديل البطاقة — حسِّن الصياغة لتتذكر أسرع.',
      flashDelete: 'حُذفت البطاقة — حافظ على مجموعة مركزة.',
      flashBackToCreator: 'العودة للمُنشئ — ابنِ بطاقات متينة.',

      todoAdd: 'أُضيفت مهمة — حدِّد وقتاً واقعياً لإنجازها.',
      todoDelete: 'حُذفت مهمة — أبقِ قائمتك مختصرة وفعّالة.',

      soundNone: 'بدون صوت — الصمت يوضّح التفكير.',
      soundRain: 'صوت المطر — مناسب للقراءة العميقة.',
      soundOcean: 'صوت البحر — ثابت ومنتظم للتركيز.',
      soundFire: 'صوت النار — دافئ وقد يشتت البعض.',

      celebrationClose: 'رائع! عندما تكون جاهزاً، ابدأ جلسة جديدة.'
    },
    en: {
      welcome: "Hello! I'm Shihab, your study guide.",
      timerStart: "Let's begin! Focus, then take a short break.",
      timerPause: 'Break time — hydrate and stretch a bit.',
      timerReset: 'Reset done. Ready for another round?',
      timerMid: 'Halfway! Keep going — great work.',
      timerNearEnd: 'Almost there — finish strong!',
      timerComplete: 'Well done! Session complete. 🎉',
      timerPreset: 'Session duration changed.',

      gpaOpen: 'GPA calculator open — add your courses carefully.',
      gpaClose: 'Calculator closed — review results when needed.',
      gpaAddCourse: "Course added — don't forget credits and grade.",
      gpaDeleteCourse: 'Course deleted — check results after changes.',

      tabTodo: 'Tasks — split work into small steps.',
      tabNotes: 'Notes — capture ideas before they fade.',
      tabFlash: 'Flashcards — ask, then answer.',
      tabSounds: 'Pick a sound to help you focus.',

      flashAdd: 'Card added — clear question, concise answer.',
      flashStart: 'Study started — flip after thinking.',
      flashNext: 'New card — test yourself confidently.',
      flashPrev: 'Previous card — quick review.',
      flashReset: 'Deck cleared — start a tidy new set.',
      flashEdit: 'Edit card — improve wording to remember faster.',
      flashDelete: 'Card deleted — keep the deck focused.',
      flashBackToCreator: 'Back to creator — build solid cards.',

      todoAdd: 'Task added — assign a realistic time.',
      todoDelete: 'Task deleted — keep your list lean.',

      soundNone: 'No sound — silence clarifies thinking.',
      soundRain: 'Rain — great for deep reading.',
      soundOcean: 'Ocean — steady, keeps focus.',
      soundFire: 'Fire — warm, might distract some.',

      celebrationClose: 'Awesome! When ready, start a new session.'
    }
  }

  let bubbleUpdateRAF = null
  let lastBubbleUpdate = 0

  function updateSpeechBubblePosition() {
    if (!character.speechBubble || !character.element) return

    const now = performance.now()
    // Throttle to ~10fps (every 100ms) for better performance
    if (now - lastBubbleUpdate < 100) return
    lastBubbleUpdate = now

    const charRect = character.element.getBoundingClientRect()
    const area = document.getElementById('characterArea')
    if (!area) return
    const areaRect = area.getBoundingClientRect()

    const charCenterX = charRect.left + charRect.width / 2 - areaRect.left
    const charTop = charRect.top - areaRect.top

    character.speechBubble.style.left = charCenterX + 'px'
    character.speechBubble.style.top = charTop - 60 + 'px'
    character.speechBubble.style.transform = 'translateX(-50%)'
  }

  function startBubblePositionUpdates() {
    if (bubbleUpdateRAF) return

    function update() {
      updateSpeechBubblePosition()
      bubbleUpdateRAF = requestAnimationFrame(update)
    }
    bubbleUpdateRAF = requestAnimationFrame(update)
  }

  function stopBubblePositionUpdates() {
    if (bubbleUpdateRAF) {
      cancelAnimationFrame(bubbleUpdateRAF)
      bubbleUpdateRAF = null
    }
  }

  function updateMessage(key) {
    if (!character.speechText) return
    const arText = messages.ar[key] || messages.ar.welcome
    const enText = messages.en[key] || messages.en.welcome
    const lang = document.documentElement.getAttribute('lang') || 'ar'
    const text = lang === 'en' ? enText : arText
    character.speechText.textContent = text
    character.speechText.setAttribute('data-ar', arText)
    character.speechText.setAttribute('data-en', enText)
  }

  function showMessage(key = 'welcome') {
    updateMessage(key)
    // Ensure bubble positioned relative to character before showing
    updateSpeechBubblePosition()

    // Show bubble briefly then hide
    if (character.speechBubble) {
      character.speechBubble.classList.add('show')
      setTimeout(() => {
        character.speechBubble.classList.remove('show')
      }, 5000)
    }
  }

  function startAutoMovement() {
    if (character.moveInterval) return

    let lastUpdate = 0
    const targetFPS = 30 // 30 FPS instead of 20 FPS (50ms)
    const frameTime = 1000 / targetFPS

    function move() {
      if (!character.element || !character.isMoving) {
        character.moveInterval = requestAnimationFrame(move)
        return
      }

      const now = performance.now()
      if (now - lastUpdate < frameTime) {
        character.moveInterval = requestAnimationFrame(move)
        return
      }
      lastUpdate = now

      const area = document.getElementById('characterArea')
      if (!area) {
        character.moveInterval = requestAnimationFrame(move)
        return
      }

      const maxWidth = area.offsetWidth - 200 // character width
      const step = 0.5

      // Change direction at edges
      if (character.currentPosition >= maxWidth - 50) {
        character.direction = -1
        character.element.classList.add('facing-left')
        character.element.classList.remove('facing-right')
      } else if (character.currentPosition <= 50) {
        character.direction = 1
        character.element.classList.add('facing-right')
        character.element.classList.remove('facing-left')
      }

      // Move
      character.currentPosition += character.direction * step
      character.element.style.left = character.currentPosition + 'px'

      character.moveInterval = requestAnimationFrame(move)
    }

    character.moveInterval = requestAnimationFrame(move)
  }

  function stopAutoMovement() {
    if (character.moveInterval) {
      cancelAnimationFrame(character.moveInterval)
      character.moveInterval = null
    }
    stopBubblePositionUpdates()
  }

  // Listen for timer state changes
  function onTimerStateChange(state) {
    if (state === 'started') {
      showMessage('middle')
    } else if (state === 'completed') {
      showMessage('completed')
    } else if (state === 'break') {
      showMessage('break')
    }
  }

  // Language change handler
  function handleLanguageChange() {
    const lang = document.documentElement.getAttribute('lang') || 'ar'
    // Message will update automatically via data-ar/data-en attributes
    showMessage('welcome')
  }

  function init() {
    character.element = document.getElementById('shihabCharacter')
    character.image = document.getElementById('shihabImage')
    character.speechBubble = document.getElementById('speechBubble')
    character.speechText = document.getElementById('speechText')

    if (!character.element) {
      console.warn('Shihab character element not found')
      return
    }

    // Set initial facing direction
    character.element.classList.add('facing-right')
    // Stop auto movement by default and ensure no movement loop
    character.isMoving = false
    stopAutoMovement()

    // Show initial message
    showMessage('welcome')

    // No auto movement; position bubble once initially
    updateSpeechBubblePosition()

    // Disable intersection-driven auto movement

    // Listen for language changes
    const observer = new MutationObserver(() => {
      handleLanguageChange()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'dir']
    })

    // Listen for timer events (if shihab.js is loaded)
    if (window.shihabTimer) {
      window.shihabTimer.onStateChange = onTimerStateChange
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Export for external use
  window.shihabSimple = {
    showMessage: showMessage,
    startMovement: startAutoMovement,
    stopMovement: stopAutoMovement
  }
})()
