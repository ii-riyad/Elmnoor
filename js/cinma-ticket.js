;(() => {
  'use strict'

  document.addEventListener('DOMContentLoaded', function () {
    initializeTicketId()
    setupImageFallbacks()
    updateVoteCounts()
  })

  /**
   * @return {void}
   */
  function initializeTicketId() {
    const ticketIdEl = document.querySelector('.ticket-id')
    if (ticketIdEl) ticketIdEl.textContent = '#' + String(Math.floor(Math.random() * 900000 + 100000))
  }

  /**
   * @return {void}
   */
  function setupImageFallbacks() {
    document.querySelectorAll('.movie-image').forEach((img) => {
      img.addEventListener('error', () => {
        const fallback = this.parentElement.querySelector('.poster-fallback')
        if (fallback) {
          fallback.style.display = 'flex'
          this.style.display = 'none'
        }
      })
    })
  }

  /**
   * @param {string} movieId
   * @param {string} movieTitle
   * @param {HTMLElement} btn
   * @return {void}
   */
  function voteMovie(movieId, movieTitle, btn) {
    document.querySelectorAll('.movie-card').forEach((card) => card.classList.remove('voted'))
    document.querySelectorAll('.vote-btn').forEach((button) => {
      button.classList.remove('voted')
      button.innerHTML = '<i class="fas fa-thumbs-up"></i> صوّت'
    })

    const card = document.querySelector(`.movie-card[data-movie="${movieId}"]`)
    if (card) card.classList.add('voted')

    btn.classList.add('voted')
    btn.innerHTML = '<i class="fas fa-check"></i> تم ✓'
    const selectedMovieEl = document.getElementById('selectedMovie')
    if (selectedMovieEl) selectedMovieEl.textContent = movieTitle

    const votes = JSON.parse(localStorage.getItem('movieVotes') || '{}')
    votes[movieId] = (votes[movieId] || 0) + 1
    localStorage.setItem('movieVotes', JSON.stringify(votes))
    updateVoteCounts()

    setTimeout(() => {
      const ticketArea = document.getElementById('ticketArea')
      if (ticketArea) {
        ticketArea.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300)
  }

  /**
   * @return {void}
   */
  function updateVoteCounts() {
    const votes = JSON.parse(localStorage.getItem('movieVotes') || '{}')
    const cards = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.movie-card'))
    cards.forEach((card) => {
      const movieId = card.dataset.movie
      const count = movieId ? votes[movieId] : 0
      const badge = card.querySelector('.vote-count')
      if (badge) badge.textContent = count
    })
  }

  /**
   * @return {Promise<void>}
   */
  async function sendTicket() {
    const nameEl = /** @type {HTMLInputElement} */ (document.getElementById('studentName'))
    const emailEl = /** @type {HTMLInputElement} */ (document.getElementById('studentEmail'))
    const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById('sendBtn'))
    const ticketIdEl = /** @type {HTMLSpanElement} */ (document.querySelector('.ticket-id'))
    const selectedMovieEl = /** @type {HTMLDivElement} */ (document.getElementById('selectedMovie'))

    const name = nameEl.value.trim() || 'زائر'
    const email = emailEl.value.trim()
    const ticketId = ticketIdEl ? ticketIdEl.textContent : '#000000'
    const selectedMovie = selectedMovieEl?.textContent

    if (!email) {
      alert('أدخل البريد الإلكتروني')
      emailEl.focus()
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('البريد غير صحيح')
      emailEl.focus()
      return
    }

    if (selectedMovie === 'لم يتم الاختيار بعد') {
      alert('يرجى اختيار فيلم أولاً')
      return
    }

    sendBtn.disabled = true
    try {
      const formData = new FormData()
      formData.append('type', 'ticket')
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', ticketId.replace('#', ''))
      formData.append('major', selectedMovie)
      formData.append(
        'message',
        `حجز تذكرة سينما علم ونور\n\nرقم التذكرة: ${ticketId}\nالاسم: ${name}\nالبريد: ${email}\nالفيلم: ${selectedMovie}\nالموعد: 5:00 PM مساءً\nالمكان: كلية الحاسبات والمعلومات | FCI Faculty (Code: CQMX0001)`
      )

      const res = await fetch('send.php/send.php', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        alert(
          '✅ تم تأكيد الحجز بنجاح!\n\nرقم التذكرة: ' + ticketId + '\n\nتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني.'
        )
        nameEl.value = ''
        emailEl.value = ''
        selectedMovieEl.textContent = 'لم يتم الاختيار بعد'
        document.querySelectorAll('.movie-card').forEach((card) => card.classList.remove('voted'))
        document.querySelectorAll('.vote-btn').forEach((button) => {
          button.classList.remove('voted')
          button.innerHTML = '<i class="fas fa-thumbs-up"></i> صوّت'
        })
      } else {
        alert('❌ ' + (data.error || 'خطأ في الإرسال'))
      }
    } catch (err) {
      console.error(err)
      alert('❌ خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.')
    } finally {
      sendBtn.disabled = false
    }
  }

  window.voteMovie = voteMovie
  window.sendTicket = sendTicket
})()
