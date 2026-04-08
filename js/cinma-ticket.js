;(function () {
  'use strict'

  document.addEventListener('DOMContentLoaded', function () {
    initializeTicketId()
    setupImageFallbacks()
    loadVotes()
  })

  function initializeTicketId() {
    const ticketIdEl = document.querySelector('.ticket-id')
    if (ticketIdEl) ticketIdEl.textContent = '#' + String(Math.floor(Math.random() * 900000 + 100000))
  }

  function setupImageFallbacks() {
    document.querySelectorAll('.movie-image').forEach((img) => {
      img.addEventListener('error', function () {
        const fallback = this.parentElement.querySelector('.poster-fallback')
        if (fallback) {
          fallback.style.display = 'flex'
          this.style.display = 'none'
        }
      })
    })
  }

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
    document.getElementById('selectedMovie').textContent = movieTitle

    const votes = JSON.parse(localStorage.getItem('movieVotes') || '{}')
    votes[movieId] = (votes[movieId] || 0) + 1
    localStorage.setItem('movieVotes', JSON.stringify(votes))
    updateVoteCounts()

    setTimeout(() => {
      document.getElementById('ticketArea').scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }

  function loadVotes() {
    updateVoteCounts()
  }

  function updateVoteCounts() {
    const votes = JSON.parse(localStorage.getItem('movieVotes') || '{}')
    document.querySelectorAll('.movie-card').forEach((card) => {
      const movieId = card.dataset.movie
      const count = votes[movieId] || 0
      const badge = card.querySelector('.vote-count')
      if (badge) badge.textContent = count
    })
  }

  async function sendTicket() {
    const nameEl = document.getElementById('studentName')
    const emailEl = document.getElementById('studentEmail')
    const sendBtn = document.getElementById('sendBtn')
    const ticketIdEl = document.querySelector('.ticket-id')
    const name = nameEl.value.trim() || 'زائر'
    const email = emailEl.value.trim()
    const ticketId = ticketIdEl ? ticketIdEl.textContent : '#000000'
    const selectedMovie = document.getElementById('selectedMovie').textContent

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

      const response = await fetch('send.php/send.php', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        alert(
          '✅ تم تأكيد الحجز بنجاح!\n\nرقم التذكرة: ' + ticketId + '\n\nتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني.'
        )
        nameEl.value = ''
        emailEl.value = ''
        document.getElementById('selectedMovie').textContent = 'لم يتم الاختيار بعد'
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
