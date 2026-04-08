;(() => {
  'use strict'

  // تعريف الحالة الأولية
  const state = {
    todos: [],
    notes: '',
    currentSound: 'rain',
    achievements: []
  }

  // 1. تعريف المتغير فارغاً في البداية لتجنب مشكلة الـ null
  let elements = {}

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

    elements.todoList.innerHTML = ''
    if (state.todos.length === 0) {
      const emptyMsg = document.createElement('div')
      emptyMsg.className = 'todo-item'
      emptyMsg.style.opacity = '0.5'
      emptyMsg.textContent =
        document.documentElement.getAttribute('lang') === 'en'
          ? 'No tasks yet. Add one!'
          : 'لا توجد مهام بعد. أضف واحدة!'
      elements.todoList.appendChild(emptyMsg)
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
      elements.todoList.appendChild(todoItem)
    })
    updateTasksCompleted()
  }

  /**
   * @return {void}
   */
  function addTodo() {
    // حماية إضافية
    if (!elements.todoInput) return

    const text = elements.todoInput.value.trim()
    if (!text) return

    state.todos.push({ text, completed: false, createdAt: Date.now() })
    elements.todoInput.value = ''
    saveTodos()
    renderTodos()
    checkAchievements()
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
    elements.tasksCompleted.textContent = completed
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
      btn.addEventListener('click', () => setSound(btn.dataset.sound))
    })
  }

  /**
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
      tab.addEventListener('click', () => switchTab(tab.dataset.tab))
    })
  }

  /**
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
      const achievementId = badge.dataset.achievement
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
    const badge = elements.achievementsGrid.querySelector(`[data-achievement="${achievementId}"]`)
    if (!badge) return
    badge.style.transform = 'scale(1.2)'
    badge.style.transition = 'transform 0.3s'
    setTimeout(() => (badge.style.transform = 'scale(1)'), 300)
  }

  /**
   * @return {void}
   */
  function checkAchievements() {
    const sessionsToday = parseInt(elements.tasksCompleted?.textContent || 0)
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
      todoList: document.getElementById('todoList'),
      todoInput: document.getElementById('todoInput'),
      addTodoBtn: document.getElementById('addTodoBtn'),
      notesTextarea: document.getElementById('notesTextarea'),
      soundButtons: document.querySelectorAll('.sound-btn'),
      toolTabs: document.querySelectorAll('.tool-tab'),
      toolContents: document.querySelectorAll('.tool-content'),
      tasksCompleted: document.getElementById('tasksCompleted'),
      achievementsGrid: document.getElementById('achievementsGrid')
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
