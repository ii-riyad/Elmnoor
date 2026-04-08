;(function () {
  'use strict'

  const form = document.getElementById('contactForm')
  const successMessage = document.getElementById('successMessage')
  const errorMessage = document.getElementById('errorMessage')

  if (!form || !successMessage || !errorMessage || !window.EmailSender) return

  form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const submitBtn = form.querySelector('.form-submit')
    const originalText = submitBtn ? submitBtn.textContent : ''
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = document.documentElement.lang === 'ar' ? 'جاري الإرسال...' : 'Sending...'
    }

    successMessage.style.display = 'none'
    errorMessage.style.display = 'none'

    try {
      const formData = new FormData(form)
      const { ok, data } = await window.EmailSender.sendEmail(formData)

      if (ok) {
        successMessage.style.display = 'block'
        form.reset()
        setTimeout(() => {
          successMessage.style.display = 'none'
        }, 5000)
      } else {
        const msg =
          data.error ||
          data.detail ||
          (document.documentElement.lang === 'ar' ? 'فشل الإرسال، حاول لاحقاً.' : 'Send failed, please try later.')
        const span = errorMessage.querySelector('span')
        if (span) span.textContent = msg
        errorMessage.style.display = 'block'
      }
    } catch {
      const span = errorMessage.querySelector('span')
      if (span) {
        span.textContent = document.documentElement.lang === 'ar' ? 'تعذر الاتصال بالخادم.' : 'Could not reach server.'
      }
      errorMessage.style.display = 'block'
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    }
  })
})()
