;(() => {
  'use strict'

  /**
   * @typedef {{ text: string, completed: boolean, createdAt?: number }} Todo
   */

  /**
   * @typedef {{
   *   todos: Todo[],
   *   notes: string,
   *   currentSound: string,
   *   achievements: string[]
   * }} StudyState
   */

  // تعريف الحالة الأولية
  /** @type {StudyState} */
  const state = {
    todos: [],
    notes: '',
    currentSound: 'rain',
    achievements: []
  }

  // 1. تعريف المتغير فارغاً في البداية لتجنب مشكلة الـ null
  /**
   * @typedef {Object} Elements
   * @property {HTMLDivElement | null} todoList
   * @property {HTMLInputElement | null} todoInput
   * @property {HTMLButtonElement | null} addTodoBtn
   * @property {HTMLTextAreaElement | null} notesTextarea
   * @property {NodeListOf<HTMLButtonElement>} soundButtons
   * @property {NodeListOf<HTMLElement>} toolTabs
   * @property {NodeListOf<HTMLElement>} toolContents
   * @property {HTMLSpanElement | null} tasksCompleted
   * @property {HTMLDivElement | null} achievementsGrid
   */

  /** @type {NodeListOf<HTMLButtonElement>} */
  const emptyButtonList = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.__no-sound-btn__'))
  /** @type {NodeListOf<HTMLElement>} */
  const emptyElementList = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.__no-tool-item__'))

  /** @type {Elements} */
  let elements = {
    todoList: null,
    todoInput: null,
    addTodoBtn: null,
    notesTextarea: null,
    soundButtons: emptyButtonList,
    toolTabs: emptyElementList,
    toolContents: emptyElementList,
    tasksCompleted: null,
    achievementsGrid: null
  }

  /**
   * @return {void}
   */
  function loadTodos() {
    const saved = localStorage.getItem('shihabTodos')
    if (saved) {
      try {
        state.todos = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading todos:', e)
        state.todos = []
      }
    }
    renderTodos()
  }

  /**
   * @return {void}
   */
  function saveTodos() {
    localStorage.setItem('shihabTodos', JSON.stringify(state.todos))
  }

  /**
   * @return {void}
   */
  function renderTodos() {
    // حماية: عدم التنفيذ إذا لم يتم تحميل القائمة بعد
    if (!elements.todoList) return
    const todoList = elements.todoList

    todoList.innerHTML = ''
    if (state.todos.length === 0) {
      const emptyMsg = document.createElement('div')
      emptyMsg.className = 'todo-item'
      emptyMsg.style.opacity = '0.5'
      emptyMsg.textContent =
        document.documentElement.getAttribute('lang') === 'en'
          ? 'No tasks yet. Add one!'
          : 'لا توجد مهام بعد. أضف واحدة!'
      todoList.appendChild(emptyMsg)
      return
    }

    state.todos.forEach((todo, index) => {
      const todoItem = document.createElement('div')
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'todo-checkbox'
      checkbox.checked = todo.completed
      checkbox.addEventListener('change', () => toggleTodo(index))

      const text = document.createElement('span')
      text.textContent = todo.text
      text.style.flex = '1'

      const deleteBtn = document.createElement('button')
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
      deleteBtn.style.background = 'transparent'
      deleteBtn.style.border = 'none'
      deleteBtn.style.cursor = 'pointer'
      deleteBtn.style.color = '#ef4444'
      deleteBtn.addEventListener('click', () => deleteTodo(index))

      todoItem.appendChild(checkbox)
      todoItem.appendChild(text)
      todoItem.appendChild(deleteBtn)
      todoList.appendChild(todoItem)
    })
    updateTasksCompleted()
  }

  /**
   * @return {boolean}
   */
  function addTodo() {
    // حماية إضافية
    if (!elements.todoInput) return false

    const text = elements.todoInput.value.trim()
    if (!text) return false

    state.todos.push({ text, completed: false, createdAt: Date.now() })
    elements.todoInput.value = ''
    saveTodos()
    renderTodos()
    checkAchievements()
    return true
  }

  /**
   * @param {number} index
   * @return {void}
   */
  function toggleTodo(index) {
    state.todos[index].completed = !state.todos[index].completed
    saveTodos()
    renderTodos()
    checkAchievements()
  }

  /**
   * @param {number} index
   * @return {void}
   */
  function deleteTodo(index) {
    state.todos.splice(index, 1)
    saveTodos()
    renderTodos()
  }

  /**
   * @return {void}
   */
  function updateTasksCompleted() {
    if (!elements.tasksCompleted) return
    const completed = state.todos.filter((t) => t.completed).length
    elements.tasksCompleted.textContent = String(completed)
  }

  /**
   * @return {void}
   */
  function loadNotes() {
    const saved = localStorage.getItem('shihabNotes')
    if (saved) {
      state.notes = saved
      if (elements.notesTextarea) elements.notesTextarea.value = state.notes
    }
  }

  /**
   * @return {void}
   */
  function saveNotes() {
    if (elements.notesTextarea) {
      state.notes = elements.notesTextarea.value
      localStorage.setItem('shihabNotes', state.notes)
    }
  }

  /**
   * @return {void}
   */
  function initSounds() {
    if (!elements.soundButtons) return
    elements.soundButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sound = btn.dataset.sound
        if (sound) setSound(sound)
      })
    })
  }

  /**
   * @param {string} sound
   * @return {void}
   */
  function setSound(sound) {
    state.currentSound = sound
    if (elements.soundButtons) {
      elements.soundButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.sound === sound))
    }
    localStorage.setItem('shihabSound', sound)
    console.log('Sound changed to:', sound)
  }

  /**
   * @return {void}
   */
  function loadSound() {
    const saved = localStorage.getItem('shihabSound')
    if (saved) setSound(saved)
  }

  /**
   * @return {void}
   */
  function initTabs() {
    if (!elements.toolTabs) return
    elements.toolTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab
        if (tabName) switchTab(tabName)
      })
    })
  }

  /**
   * @param {string} tabName
   * @return {void}
   */
  function switchTab(tabName) {
    elements.toolTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName))
    elements.toolContents.forEach((content) => content.classList.toggle('active', content.id === `${tabName}Content`))
  }

  /**
   * @return {void}
   */
  function loadAchievements() {
    const saved = localStorage.getItem('shihabAchievements')
    if (saved) {
      try {
        state.achievements = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading achievements:', e)
        state.achievements = []
      }
    }
    renderAchievements()
  }

  /**
   * @return {void}
   */
  function saveAchievements() {
    localStorage.setItem('shihabAchievements', JSON.stringify(state.achievements))
  }

  /**
   * @return {void}
   */
  function renderAchievements() {
    if (!elements.achievementsGrid) return
    elements.achievementsGrid.querySelectorAll('.achievement-badge').forEach((badge) => {
      const achievementId = badge.getAttribute('data-achievement')
      if (!achievementId) return
      badge.classList.toggle('unlocked', state.achievements.includes(achievementId))
    })
  }

  /**
   * @param {string} achievementId
   * @return {void}
   */
  function unlockAchievement(achievementId) {
    if (state.achievements.includes(achievementId)) return
    state.achievements.push(achievementId)
    saveAchievements()
    renderAchievements()
    showAchievementNotification(achievementId)
  }

  /**
   * @param {string} achievementId
   * @return {void}
   */
  function showAchievementNotification(achievementId) {
    if (!elements.achievementsGrid) return
    const badge = /** @type {HTMLElement | null} */ (
      elements.achievementsGrid.querySelector(`[data-achievement="${achievementId}"]`)
    )
    if (!badge) return
    badge.style.transform = 'scale(1.2)'
    badge.style.transition = 'transform 0.3s'
    setTimeout(() => (badge.style.transform = 'scale(1)'), 300)
  }

  /**
   * @return {void}
   */
  function checkAchievements() {
    const sessionsToday = parseInt(elements.tasksCompleted?.textContent || '0', 10)
    if (sessionsToday > 0 && !state.achievements.includes('first-session')) unlockAchievement('first-session')

    const completedTasks = state.todos.filter((t) => t.completed).length
    if (completedTasks >= 10 && !state.achievements.includes('tasks-10')) unlockAchievement('tasks-10')
  }

  /**
   * دالة التهيئة الرئيسية (المعدلة)
   * @return {void}
   */
  function init() {
    // 2. تعيين العناصر هنا فقط بعد تحميل الصفحة لضمان وجودها
    elements = {
      todoList: /** @type {HTMLDivElement | null} */ (document.getElementById('todoList')),
      todoInput: /** @type {HTMLInputElement | null} */ (document.getElementById('todoInput')),
      addTodoBtn: /** @type {HTMLButtonElement | null} */ (document.getElementById('addTodoBtn')),
      notesTextarea: /** @type {HTMLTextAreaElement | null} */ (document.getElementById('notesTextarea')),
      soundButtons: document.querySelectorAll('.sound-btn'),
      toolTabs: document.querySelectorAll('.tool-tab'),
      toolContents: document.querySelectorAll('.tool-content'),
      tasksCompleted: /** @type {HTMLSpanElement | null} */ (document.getElementById('tasksCompleted')),
      achievementsGrid: /** @type {HTMLDivElement | null} */ (document.getElementById('achievementsGrid'))
    }

    // التحقق من أن العناصر الأساسية موجودة
    if (!elements.todoList) {
      console.warn('Study Tools: DOM elements not found via JS init.')
      return
    }

    // إضافة مستمعي الأحداث (Event Listeners)
    if (elements.addTodoBtn) elements.addTodoBtn.addEventListener('click', addTodo)

    if (elements.todoInput)
      elements.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo()
      })

    if (elements.notesTextarea) elements.notesTextarea.addEventListener('input', saveNotes)

    // تحميل البيانات المحفوظة
    loadTodos()
    loadNotes()
    initSounds()
    loadSound()
    initTabs()
    loadAchievements()

    // ربط مع المؤقت إذا كان موجوداً
    if (window.studyTimerEnhanced) {
      const originalOnStateChange = window.studyTimerEnhanced.onStateChange
      window.studyTimerEnhanced.onStateChange = (state) => {
        if (originalOnStateChange) originalOnStateChange(state)
        if (state === 'completed') checkAchievements()
      }
    }
  }

  // تشغيل الكود عند جاهزية الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // تصدير الدوال للاستخدام الخارجي إذا لزم الأمر
  window.studyTools = { addTodo, toggleTodo, deleteTodo, saveNotes, setSound, unlockAchievement }
})()
