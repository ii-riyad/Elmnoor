// i18n.js — Elm & Noor (robust)
;(function () {
  'use strict'

  const STORAGE_KEY = 'siteLang',
    VER_KEY = 'i18nVer',
    VER = '4'

  const DICT = {
    الرئيسية: 'Home',
    التخصصات: 'Majors',
    الجامعات: 'Universities',
    الخدمات: 'Services',
    خدماتنا: 'Our Services',
    'اتصل بنا': 'Contact',
    'علم ونور': 'Elm & Noor',
    'Elm w Noor': 'Elm & Noor',
    'ادرس في ماليزيا!': 'Study in Malaysia!',
    'دليلك للتعليم العالمي': 'Your guide to world-class education',
    'التخصصات المتاحة': 'Available Majors',
    'اختر التخصص الذي يناسب شغفك وطموحك!': 'Choose the major that matches your passion and ambition!',
    'كل ما تحتاجه لمشوارك الأكاديمي!': 'Everything you need for your academic journey!',
    'هل أنت مستعد لبدء رحلتك؟': 'Ready to start your journey?',
    'انضم إلى آلاف الطلاب الذين يحققون أحلامهم في ماليزيا!':
      'Join thousands of students achieving their dreams in Malaysia!',
    'تصفح الجامعات': 'Browse Universities',
    'استكشف الجامعات': 'Explore Universities',
    'اتصل بنا': 'Contact Us',
    'التسجيل في الجامعات': 'University Applications',
    'الإرشاد الأكاديمي': 'Academic Guidance',
    'الاستقبال من المطار': 'Airport Pickup',
    'المساعدة في التأشيرة': 'Visa Assistance',
    'دعم السكن': 'Accommodation Support',
    'المواد الدراسية': 'Study Materials',
    'نساعدك في التسجيل في جامعات معترف بها دولياً': 'We help you apply to internationally recognized universities',
    'احصل على إرشاد أكاديمي شخصي طوال رحلتك': 'Get personalized academic guidance throughout your journey',
    'نستقبلك في المطار ونساعدك على الاستقرار': 'We pick you up at the airport and help you settle in',
    'دعم كامل للتأشيرة بما في ذلك إعداد المستندات': 'Complete visa support, including preparing documents',
    'ابحث عن سكن مناسب بالقرب من جامعتك': 'Find suitable housing near your university',
    'الوصول إلى مواد دراسية شاملة لجميع التخصصات': 'Access comprehensive study materials for all majors',
    'علوم الحاسوب وتقنية المعلومات': 'Computer Science & IT',
    الهندسة: 'Engineering',
    'الطب والعلوم الصحية': 'Medicine & Health Sciences',
    'إدارة الأعمال': 'Business Administration',
    'العلوم الطبيعية': 'Natural Sciences',
    'القانون والعلوم الإنسانية': 'Law & Humanities',
    'فيزياء، كيمياء، أحياء، رياضيات': 'Physics, Chemistry, Biology, Mathematics',
    'تصميم جرافيك، رسوم متحركة، عمارة': 'Graphic Design, Animation, Architecture',
    'قانون، علوم سياسية، علم نفس': 'Law, Political Science, Psychology',
    'تعليم، لغات، تربية خاصة': 'Teaching, Languages, Special Education'
  }

  const ORIG = new WeakMap()
  function setDirLang(lang) {
    const isEn = lang === 'en'
    document.documentElement.setAttribute('lang', isEn ? 'en' : 'ar')
    document.documentElement.setAttribute('dir', isEn ? 'ltr' : 'rtl')
  }

  function applyDataAttributes(lang) {
    document.querySelectorAll('[data-ar], [data-en]').forEach((el) => {
      const val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar')
      if (val !== null && (el.children.length === 0 || el.hasAttribute('data-i18n-mode'))) el.textContent = val
      ;['placeholder', 'title', 'alt', 'aria-label', 'data-tooltip', 'data-bubble', 'href'].forEach((a) => {
        const arA = 'data-ar-' + a,
          enA = 'data-en-' + a
        if (el.hasAttribute(arA) || el.hasAttribute(enA)) {
          const v = lang === 'en' ? el.getAttribute(enA) : el.getAttribute(arA)
          if (v !== null) el.setAttribute(a, v)
        }
      })
    })
  }

  function walkTextNodes(root, cb) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement
        if (!p) return NodeFilter.FILTER_REJECT
        const skip = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME']
        if (skip.includes(p.tagName)) return NodeFilter.FILTER_REJECT
        if (p.hasAttribute('data-ar') || p.hasAttribute('data-en')) return NodeFilter.FILTER_REJECT
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      }
    })
    let n
    while ((n = walker.nextNode())) cb(n)
  }

  function applyDict(lang) {
    walkTextNodes(document.body, (node) => {
      if (!ORIG.has(node)) ORIG.set(node, node.nodeValue)
      const original = ORIG.get(node).trim()
      if (lang === 'en' && DICT[original]) node.nodeValue = DICT[original]
      else if (lang === 'ar') node.nodeValue = ORIG.get(node)
    })
  }

  function applyPlaceholders(lang) {
    const map = {
      ar: { email: 'البريد الإلكتروني', name: 'الاسم', phone: 'رقم الهاتف', message: 'رسالتك' },
      en: { email: 'Email', name: 'Name', phone: 'Phone number', message: 'Your message' }
    }
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
      const name = (el.getAttribute('name') || '').toLowerCase(),
        type = (el.getAttribute('type') || '').toLowerCase(),
        key = name || (type === 'email' ? 'email' : '')
      if (key && map[lang][key]) el.setAttribute('placeholder', map[lang][key])
    })
  }

  function updateToggleLabel(lang) {
    const btn = document.getElementById('langToggleBtn')
    if (!btn) return
    let span = btn.querySelector('span')
    if (!span) {
      span = document.createElement('span')
      btn.appendChild(span)
    }
    span.textContent = lang === 'en' ? 'عربي' : 'English'
  }

  // Schedule heavy text/placeholder work so it doesn't block initial paint
  function scheduleEnhancements(lang) {
    const runHeavy = () => {
      applyDict(lang)
      applyPlaceholders(lang)
    }
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(runHeavy, { timeout: 1500 })
    } else {
      setTimeout(runHeavy, 0)
    }
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang)
    setDirLang(lang)
    applyDataAttributes(lang)
    applyDict(lang)
    applyPlaceholders(lang)
    updateToggleLabel(lang)
  }

  // Lighter init path to improve LCP/TBT: avoid TreeWalker when staying in Arabic
  function init() {
    if (localStorage.getItem(VER_KEY) !== VER) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(VER_KEY, VER)
    }
    const initialLang = localStorage.getItem(STORAGE_KEY) || 'ar'
    setDirLang(initialLang)
    applyDataAttributes(initialLang)
    updateToggleLabel(initialLang)
    if (initialLang === 'en') {
      scheduleEnhancements('en')
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('#langToggleBtn')
    if (!btn) return
    const current = localStorage.getItem(STORAGE_KEY) || 'ar'
    setLang(current === 'ar' ? 'en' : 'ar')
  })
  window.setSiteLang = setLang
})()
