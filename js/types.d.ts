/**
 * Global type definitions for Elm & Noor application
 * These types describe all window-scoped variables and functions
 */

interface Window {
  // Email Service
  EmailSender: {
    sendEmail: (formData: FormData) => Promise<{ ok: boolean; data: any }>
    ENDPOINT: string
  }

  // Cinema Ticket Booking
  voteMovie: (movieId: string, movieTitle: string, btn: HTMLButtonElement) => void
  sendTicket: () => Promise<void>

  // Navigation & Scrolling
  scrollToCard: (index: number) => void

  // GPA Calculator
  openGpaSidebar: () => void
  closeGpaSidebar: () => void
  addCourseRow: () => void
  deleteCourseRow: (button: HTMLButtonElement) => void
  calculateGPA: () => void

  // Study Tools Suite
  studyTools: {
    addTodo: (text?: string) => boolean
    toggleTodo: (index: number) => void
    deleteTodo: (index: number) => void
    saveNotes: () => void
    setSound: (sound: string) => void
    unlockAchievement: (achievementId: string) => void
  }

  // Study Timer Enhanced
  studyTimerEnhanced: {
    start: () => void
    pause: () => void
    stop: () => void
    updateDisplay: () => void
    isRunning: () => boolean
    isPaused: () => boolean
    getState: () => {
      isRunning: boolean
      isPaused: boolean
      currentTime: number
      totalTime: number
    }
    onStateChange?: (state: 'running' | 'paused' | 'stopped') => void
    updateTimer?: (time: number, total: number) => void
  }

  // Study Interactions & Character
  studyInteractions: {
    addXP: (amount: number) => void
    showCelebration: (icon: string, title: string, message: string) => void
    triggerCharacterReaction: (type: string) => void
    createParticles: (count?: number) => void
    createConfetti: () => void
  }
  closeCelebration: () => void

  // Internationalization
  setSiteLang: (lang: 'ar' | 'en') => void
  i18nUpdateElements?: boolean

  // Study Tools (alternative reference)
  shihabSimple?: {
    showMessage: (key: string) => void
  }

  // GPA Calculator UI Functions
  openGpaSidebar?: () => void
}
