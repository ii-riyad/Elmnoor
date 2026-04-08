;(() => {
  'use strict'

  /**
   * @returns {void}
   */
  function initMLLink() {
    const mlBtn = document.getElementById('ml-read-more-btn')
    if (!mlBtn) {
      setTimeout(initMLLink, 100)
      return
    }

    const newBtn = mlBtn.cloneNode(true)
    mlBtn.parentNode?.replaceChild(newBtn, mlBtn)

    newBtn.addEventListener(
      'click',
      (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()
        window.location.assign('machine-learning-malaysia.html')
        return false
      },
      true
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMLLink)
  } else {
    initMLLink()
  }
})()
