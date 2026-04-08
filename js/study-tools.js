document.addEventListener('DOMContentLoaded', () => {
  console.log('Shihab Tools: Ready & Loaded 🚀')

  const cardsStr = localStorage.getItem('shihabCards')
  const todosStr = localStorage.getItem('shihabTodos')

  // --- 1. إدارة الحالة (State Management) ---
  const state = {
    timer: {
      timeLeft: 25 * 60,
      originalTime: 25 * 60,
      isRunning: false,
      /** @type {number | undefined} */
      interval: undefined
    },
    flashcards: cardsStr ? JSON.parse(cardsStr) : [],
    cardIndex: 0,
    todos: todosStr ? JSON.parse(todosStr) : [],
    /** @type {HTMLAudioElement | null} */
    audio: null
  }

  // --- 2. تعريف العناصر الثابتة ---
  const els = {
    // Timer
    timerDisplay: document.getElementById('timerDisplay'),
    timerCircle: document.getElementById('timerCircle'),
    timerCard: document.querySelector('.timer-card'),
    fullscreenBtn: document.getElementById('fullscreenTimerBtn'),
    flipM1: document.querySelector('[data-digit="m1"]'),
    flipM2: document.querySelector('[data-digit="m2"]'),
    flipS1: document.querySelector('[data-digit="s1"]'),
    flipS2: document.querySelector('[data-digit="s2"]'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stopBtn: document.getElementById('stopBtn'),

    // Flashcards Inputs & Display
    fcFront: document.getElementById('flashcardFrontInput'),
    fcBack: document.getElementById('flashcardBackInput'),
    fcCount: document.getElementById('flashcardCount'),
    cardElement: document.getElementById('flashcardElement'),
    cardFront: document.getElementById('cardFrontText'),
    cardBack: document.getElementById('cardBackText'),

    // Sections
    creatorSection: document.getElementById('creatorSection'),
    studySection: document.getElementById('studySection'),

    // GPA
    gpaSidebar: document.getElementById('gpa-sidebar'),
    gpaOverlay: document.getElementById('gpa-overlay'),
    coursesBody: document.getElementById('courses-body'),

    // ToDo
    todoList: document.getElementById('todoList'),
    todoInput: document.getElementById('todoInput'),

    // Overlay
    celebration: document.getElementById('celebrationOverlay')
  }

  /**
   * Helper: trigger Shihab bubble message
   * @param {string} key - The message key to trigger (e.g., 'timerStart', 'flashAdd', etc.)
   * @returns {void}
   */
  function triggerBubble(key) {
    if (window.shihabSimple && typeof window.shihabSimple.showMessage === 'function') {
      try {
        window.shihabSimple.showMessage(key || 'welcome')
      } catch (e) {}
    }
  }

  /* ===========================================================
       3. معالج النقرات الشامل (The Master Click Handler)
       هذا الجزء هو "الدماغ" الذي يشغل كل الأزرار
       =========================================================== */
  document.addEventListener('click', (e) => {
    // البحث عن العنصر المضغوط أو أقرب زر (في حال ضغطت على الأيقونة)
    const target = /** @type {HTMLElement | null} */ (e.target)
    if (!target) return
    const btn = /** @type {HTMLElement} */ (target.closest('button') || target)
    const id = btn.id

    // --- أزرار المؤقت ---
    if (id === 'startBtn') {
      startTimer()
    }
    if (id === 'pauseBtn') {
      pauseTimer()
    }
    if (id === 'stopBtn') {
      resetTimer()
      triggerBubble('timerReset')
    }
    if (id === 'fullscreenTimerBtn') {
      const isFullscreen = els.timerCard && els.timerCard.classList.contains('fullscreen')
      setFullscreenState(!isFullscreen)
    }

    // --- أزرار إعدادات الوقت (Presets) ---
    if (btn.classList.contains('preset-btn')) {
      if (state.timer.isRunning) return // لا تغير الوقت أثناء التشغيل
      document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      if (btn.dataset.duration) {
        const min = parseInt(btn.dataset.duration)
        state.timer.originalTime = min * 60
        state.timer.timeLeft = min * 60
        updateTimerUI()
        triggerBubble('timerPreset')
      }
    }

    // --- أزرار البطاقات (Flashcards) ---
    if (id === 'addFlashcardBtn') {
      addFlashcard()
      triggerBubble('flashAdd')
    }
    if (id === 'startStudyBtn') {
      startStudyMode()
      triggerBubble('flashStart')
    }
    if (id === 'nextCardBtn') {
      nextCard()
      triggerBubble('flashNext')
    }
    if (id === 'prevCardBtn') {
      prevCard()
      triggerBubble('flashPrev')
    }
    if (id === 'backToCreatorBtn') {
      if (els.studySection && els.creatorSection) {
        els.studySection.style.display = 'none'
        els.creatorSection.style.display = 'block'
      }
      triggerBubble('flashBackToCreator')
    }
    if (id === 'resetDeckBtn') {
      if (confirm('هل أنت متأكد من حذف جميع البطاقات؟')) {
        state.flashcards = []
        saveCards()
        updateFlashcardUI()
        triggerBubble('flashReset')
      }
    }
    if (id === 'deleteCardBtn') {
      deleteCurrentCard()
      triggerBubble('flashDelete')
    }
    if (id === 'editCardBtn') {
      editCurrentCard()
      triggerBubble('flashEdit')
    }

    // --- أزرار الحاسبة (GPA) ---
    if (id === 'gpaToggleBtn') {
      if (els.gpaSidebar && els.gpaOverlay) {
        els.gpaSidebar.classList.add('open')
        els.gpaOverlay.classList.add('show')
      }
      triggerBubble('gpaOpen')
    }
    if (id === 'closeGpaBtn' || target.id === 'gpa-overlay') {
      if (els.gpaSidebar && els.gpaOverlay) {
        els.gpaSidebar.classList.remove('open')
        els.gpaOverlay.classList.remove('show')
      }
      triggerBubble('gpaClose')
    }
    if (id === 'addCourseBtn') {
      addCourseRow()
      triggerBubble('gpaAddCourse')
    }
    if (target.classList.contains('delete-course-btn') || btn.classList.contains('delete-course-btn')) {
      const row = target.closest('tr') || btn.closest('tr')
      if (row) row.remove()
      calcGPA()
      triggerBubble('gpaDeleteCourse')
    }

    // --- أزرار المهام (ToDo) ---
    if (id === 'addTodoBtn') {
      if (addTodo()) triggerBubble('todoAdd')
    }
    if (target.classList.contains('delete-todo-btn')) {
      const index = target.dataset.index
      state.todos.splice(index, 1)
      saveTodos()
      renderTodos()
      triggerBubble('todoDelete')
    }

    // --- أزرار التبويبات (Tabs) ---
    if (btn.classList.contains('tool-tab')) {
      document.querySelectorAll('.tool-tab').forEach((t) => t.classList.remove('active'))
      document.querySelectorAll('.tool-content').forEach((c) => c.classList.remove('active'))
      btn.classList.add('active')
      const contentId = btn.dataset.tab + 'Content'
      const contentEl = document.getElementById(contentId)
      if (contentEl) contentEl.classList.add('active')
      /** @type {Record<string, string>} */
      const tabKeyMap = { todo: 'tabTodo', notes: 'tabNotes', flashcards: 'tabFlash', sounds: 'tabSounds' }
      const tabKey = (btn.dataset.tab && tabKeyMap[btn.dataset.tab]) || 'tabTodo'
      triggerBubble(tabKey)
    }

    // --- أزرار الأصوات ---
    if (btn.classList.contains('sound-btn')) {
      document.querySelectorAll('.sound-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const soundType = btn.dataset.sound || 'none'
      playSound(soundType)
      /** @type {Record<string, string>} */
      const soundKeyMap = { none: 'soundNone', rain: 'soundRain', ocean: 'soundOcean', fire: 'soundFire' }
      const soundKey = (soundKeyMap[soundType]) || 'soundNone'
      triggerBubble(soundKey)
    }

    // --- إغلاق نافذة الاحتفال ---
    if (id === 'closeCelebrationBtn') {
      if (els.celebration) els.celebration.classList.remove('show')
      triggerBubble('celebrationClose')
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && els.timerCard && els.timerCard.classList.contains('fullscreen')) {
      setFullscreenState(false)
    }
  })

  // --- مستمع خاص لقلب البطاقة (عند النقر عليها) ---
  if (els.cardElement) {
    els.cardElement.addEventListener('click', () => {
      els.cardElement?.classList.toggle('is-flipped')
    })
  }

  // --- مستمع لتحديث المعدل عند تغيير القيم ---
  document.addEventListener('change', (e) => {
    const target = /** @type {HTMLElement | null} */ (e.target)
    if (!target) return
    if (target.classList.contains('gpa-select')) {
      calcGPA()
    }
    // حفظ الملاحظات
    if (target.id === 'notesTextarea') {
      const textArea = /** @type {HTMLTextAreaElement | null} */ (target)
      if (textArea?.value) {
        localStorage.setItem('shihabNotes', textArea.value)
      }
    }
  })

  /* ===========================================================
       4. الوظائف والمنطق (Logic Functions)
       =========================================================== */

  // --- Timer Logic ---
  /**
   * @returns {void}
   */
  function startTimer() {
    if (state.timer.isRunning) return
    state.timer.isRunning = true
    updateControls('running')

    // Trigger Shihab bubble on start
    triggerBubble('timerStart')

    state.timer.interval = setInterval(() => {
      if (state.timer.timeLeft > 0) {
        state.timer.timeLeft--
        updateTimerUI()

        // Trigger mid-session or almost-done hints
        const half = Math.floor(state.timer.originalTime / 2)
        if (state.timer.timeLeft === half) {
          triggerBubble('timerMid')
        }
        if (state.timer.timeLeft === 120 || state.timer.timeLeft === 60) {
          triggerBubble('timerNearEnd')
        }
      } else {
        finishTimer()
      }
    }, 1000)
  }

  /**
   * @returns {void}
   */
  function pauseTimer() {
    if (state.timer.interval) clearInterval(state.timer.interval)
    state.timer.isRunning = false
    updateControls('paused')
    // Show break message when paused
    triggerBubble('timerPause')
  }

  /**
   * @returns {void}
   */
  function resetTimer() {
    if (state.timer.interval) clearInterval(state.timer.interval)
    state.timer.isRunning = false
    state.timer.timeLeft = state.timer.originalTime
    updateTimerUI()
    updateControls('stopped')
  }

  /**
   * @returns {void}
   */
  function finishTimer() {
    resetTimer()
    if (els.celebration) els.celebration.classList.add('show')
    playSound('celebration') // Optional sound
    // Show completion message
    triggerBubble('timerComplete')
  }

  /**
   * @param {string} status - 'running', 'paused', or 'stopped'
   * @returns {void}
   */
  function updateControls(status) {
    if (status === 'running') {
      if (els.startBtn) els.startBtn.style.display = 'none'
      if (els.pauseBtn) els.pauseBtn.style.display = 'inline-flex'
      if (els.stopBtn) els.stopBtn.style.display = 'inline-flex'
    } else if (status === 'paused') {
      if (els.startBtn) els.startBtn.style.display = 'inline-flex'
      if (els.startBtn) els.startBtn.innerHTML = '<i class="fas fa-play"></i> استئناف'
      if (els.pauseBtn) els.pauseBtn.style.display = 'none'
    } else {
      // stopped
      if (els.startBtn) els.startBtn.style.display = 'inline-flex'
      if (els.startBtn) els.startBtn.innerHTML = '<i class="fas fa-play"></i> ابدأ الجلسة'
      if (els.pauseBtn) els.pauseBtn.style.display = 'none'
      if (els.stopBtn) els.stopBtn.style.display = 'none'
    }
  }

  /**
   * @param {boolean} isFullscreen - Whether to set the timer to fullscreen mode or not
   * @returns {void}
   */
  function setFullscreenState(isFullscreen) {
    if (!els.timerCard || !els.fullscreenBtn) return
    els.timerCard.classList.toggle('fullscreen', isFullscreen)
    document.body.classList.toggle('timer-fullscreen-active', isFullscreen)
    const lang = document.documentElement.lang || 'ar'
    if (isFullscreen) {
      els.fullscreenBtn.textContent = lang === 'en' ? 'Exit Fullscreen' : 'خروج'
    } else {
      els.fullscreenBtn.textContent = lang === 'en' ? 'Fullscreen Timer' : 'تكبير المؤقت'
    }
  }

  /**
   * Helper to set flip digit and trigger animation if value changes
   * @param {HTMLElement} el - The element representing the digit to flip
   * @param {string} value - The new value to set (should be a single character)
   * @returns {void}
   */
  function setFlipDigit(el, value) {
    if (!el) return
    if (el.textContent !== value) {
      el.textContent = value
      el.classList.remove('flip-animate')
      void el.offsetWidth
      el.classList.add('flip-animate')
    }
  }

  /**
   * @returns {void}
   */
  function updateTimerUI() {
    const m = Math.floor(state.timer.timeLeft / 60)
    const s = state.timer.timeLeft % 60
    const mm = m.toString().padStart(2, '0')
    const ss = s.toString().padStart(2, '0')
    const timeText = `${mm}:${ss}`

    if (els.timerDisplay) els.timerDisplay.innerText = timeText
    const flipM1 = /** @type {HTMLElement | null} */ (els.flipM1)
    const flipM2 = /** @type {HTMLElement | null} */ (els.flipM2)
    const flipS1 = /** @type {HTMLElement | null} */ (els.flipS1)
    const flipS2 = /** @type {HTMLElement | null} */ (els.flipS2)
    if (flipM1) setFlipDigit(flipM1, mm[0])
    if (flipM2) setFlipDigit(flipM2, mm[1])
    if (flipS1) setFlipDigit(flipS1, ss[0])
    if (flipS2) setFlipDigit(flipS2, ss[1])
    document.title = `${timeText} - Study Timer`

    if (els.timerCircle) {
      const radius = 45
      const circumference = 2 * Math.PI * radius
      const percent = state.timer.timeLeft / state.timer.originalTime
      const offset = circumference - percent * circumference

      els.timerCircle.style.strokeDasharray = `${circumference} ${circumference}`
      els.timerCircle.style.strokeDashoffset = String(offset)
    }
  }

  // --- Flashcards Logic ---

  /**
   * @returns {void}
   */
  function addFlashcard() {
    const fcFrontEl = /** @type {HTMLInputElement | null} */ (els.fcFront)
    const fcBackEl = /** @type {HTMLInputElement | null} */ (els.fcBack)
    if (!fcFrontEl || !fcBackEl) return
    const front = fcFrontEl.value.trim()
    const back = fcBackEl.value.trim()
    if (front && back) {
      state.flashcards.push({ front, back })
      saveCards()
      fcFrontEl.value = ''
      fcBackEl.value = ''
      fcFrontEl.focus()
      updateFlashcardUI()
    } else {
      alert('الرجاء كتابة السؤال والجواب')
    }
  }

  /**
   * @returns {void}
   */
  function startStudyMode() {
    if (state.flashcards.length === 0) {
      alert('أضف بطاقات أولاً!')
      return
    }
    if (els.creatorSection) els.creatorSection.style.display = 'none'
    if (els.studySection) els.studySection.style.display = 'block'
    state.cardIndex = 0
    showCard(0)
  }

  /**
   * @param {number} index - The index of the flashcard to show
   * @returns {void}
   */
  function showCard(index) {
    if (!els.cardElement) return
    els.cardElement.classList.remove('is-flipped') // Reset flip

    // Timeout small delay to allow flip reset if needed visually
    setTimeout(() => {
      if (els.cardFront && state.flashcards[index]) {
        els.cardFront.innerText = state.flashcards[index].front
      }
      if (els.cardBack && state.flashcards[index]) {
        els.cardBack.innerText = state.flashcards[index].back
      }
    }, 150)
  }

  /**
   * @returns {void}
   */
  function nextCard() {
    if (state.cardIndex < state.flashcards.length - 1) {
      state.cardIndex++
      showCard(state.cardIndex)
    } else {
      if (confirm('وصلت للنهاية! هل تريد العودة للبداية؟')) {
        state.cardIndex = 0
        showCard(0)
      }
    }
  }

  /**
   * @returns {void}
   */
  function prevCard() {
    if (state.cardIndex > 0) {
      state.cardIndex--
      showCard(state.cardIndex)
    }
  }

  /**
   * @returns {void}
   */
  function deleteCurrentCard() {
    if (confirm('حذف هذه البطاقة؟')) {
      state.flashcards.splice(state.cardIndex, 1)
      saveCards()
      if (state.flashcards.length === 0) {
        if (els.studySection) els.studySection.style.display = 'none'
        if (els.creatorSection) els.creatorSection.style.display = 'block'
      } else {
        if (state.cardIndex >= state.flashcards.length) state.cardIndex--
        showCard(state.cardIndex)
      }
    }
  }

  /**
   * @returns {void}
   */
  function editCurrentCard() {
    const card = state.flashcards[state.cardIndex]
    const fcFrontEl = /** @type {HTMLInputElement | null} */ (els.fcFront)
    const fcBackEl = /** @type {HTMLInputElement | null} */ (els.fcBack)
    if (fcFrontEl) fcFrontEl.value = card.front
    if (fcBackEl) fcBackEl.value = card.back
    deleteCurrentCard() // Remove old one so updated one is added new
    if (els.studySection) els.studySection.style.display = 'none'
    if (els.creatorSection) els.creatorSection.style.display = 'block'
  }

  /**
   * @returns {void}
   */
  function saveCards() {
    localStorage.setItem('shihabCards', JSON.stringify(state.flashcards))
    updateFlashcardUI()
  }

  /**
   * @returns {void}
   */
  function updateFlashcardUI() {
    if (els.fcCount) els.fcCount.innerText = state.flashcards.length
  }

  // --- GPA Logic ---

  /**
   * @returns {void}
   */
  function addCourseRow() {
    if (!els.coursesBody) return
    const row = document.createElement('tr')
    row.innerHTML = `
            <td><input type="text" class="gpa-input" style="width:100%"></td>
            <td>
                <select class="gpa-select cr">
                    <option value="3">3</option><option value="4">4</option><option value="2">2</option><option value="1">1</option>
                </select>
            </td>
            <td>
                <select class="gpa-select gr">
                    <option value="4.00">A</option>
                    <option value="3.67">A-</option>
                    <option value="3.33">B+</option>
                    <option value="3.00">B</option>
                    <option value="2.67">B-</option>
                    <option value="2.33">C+</option>
                    <option value="2.00">C</option>
                    <option value="0.00">F</option>
                </select>
            </td>
            <td><button class="delete-course-btn" style="color:red;border:none;background:none;font-weight:bold;cursor:pointer">X</button></td>
        `
    els.coursesBody.appendChild(row)
    calcGPA()
  }

  /**
   * @returns {void}
   */
  function calcGPA() {
    const rows = document.querySelectorAll('#courses-body tr')
    let totalPts = 0,
      totalCrs = 0

    rows.forEach((r) => {
      const crEl = /** @type {HTMLInputElement | null} */ (r.querySelector('.cr'))
      const grEl = /** @type {HTMLInputElement | null} */ (r.querySelector('.gr'))
      const cr = crEl ? parseFloat(crEl.value) : NaN
      const gr = grEl ? parseFloat(grEl.value) : NaN
      if (!isNaN(cr) && !isNaN(gr)) {
        totalPts += cr * gr
        totalCrs += cr
      }
    })

    const result = totalCrs > 0 ? (totalPts / totalCrs).toFixed(2) : '0.00'
    const resEl = document.getElementById('calculated-gpa')
    if (resEl) resEl.innerText = result

    // Update Credits Display if exists
    const credEl = document.getElementById('total-credits')
    if (credEl) credEl.innerText = Math.round(totalCrs).toString()
  }

  // --- To-Do Logic ---

  /**
   * @returns {boolean} - Returns true if a new to-do was added, false otherwise
   */
  function addTodo() {
    const todoInputEl = /** @type {HTMLInputElement | null} */ (els.todoInput)
    if (!todoInputEl) return false
    const text = todoInputEl.value.trim()
    if (text) {
      state.todos.push({ text: text, completed: false })
      saveTodos()
      renderTodos()
      todoInputEl.value = ''
      return true
    }
    return false
  }

  /**
   * @returns {void}
   */
  function renderTodos() {
    if (!els.todoList) return
    els.todoList.innerHTML = ''
    state.todos.forEach((/** @type {any} */ t, /** @type {number} */ i) => {
      const div = document.createElement('div')
      div.className = `todo-item ${t.completed ? 'completed' : ''}`
      div.innerHTML = `
                <span>${t.text}</span>
                <i class="fas fa-trash delete-todo-btn" data-index="${i}" style="color:#ef4444; cursor:pointer; margin-right:auto;"></i>
            `
      div.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement | null} */ (e.target)
        if (target && !target.classList.contains('delete-todo-btn')) {
          state.todos[i].completed = !state.todos[i].completed
          saveTodos()
          renderTodos()
        }
      })
      if (els.todoList) els.todoList.appendChild(div)
    })
  }

  /**
   * @returns {void}
   */
  function saveTodos() {
    localStorage.setItem('shihabTodos', JSON.stringify(state.todos))
  }

  // --- Sounds Logic ---

  /**
   * @param {string} type - The type of sound to play (e.g., 'rain', 'ocean', 'fire', 'forest', 'cafe', or 'none')
   * @returns {void}
   */
  function playSound(type) {
    if (state.audio) {
      state.audio.pause()
      state.audio = null
    }

    const sounds = /** @type {Record<string, string>} */ ({
      rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
      ocean: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
      fire: 'https://cdn.jsdelivr.net/gh/prof3ssorSt3v3/media-sample-files@master/fireplace.mp3',
      forest: 'https://actions.google.com/sounds/v1/relax/forest_sounds.ogg',
      cafe: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'
    })

    if (type !== 'none' && sounds[type]) {
      state.audio = new Audio(sounds[type])
      state.audio.loop = true
      state.audio.play().catch((/** @type {any} */ e) => console.log('Audio play error:', e))
    }
  }

  // --- Initialization ---
  if (els.fullscreenBtn && els.timerCard) {
    setFullscreenState(false)
  }
  updateTimerUI()
  updateFlashcardUI()
  renderTodos()
  addCourseRow() // Add initial row for GPA

  // Load saved notes
  const savedNotes = localStorage.getItem('shihabNotes')
  if (savedNotes) {
    const notesEl = /** @type {HTMLInputElement | null} */ (document.getElementById('notesTextarea'))
    if (notesEl) notesEl.value = savedNotes
  }
})
