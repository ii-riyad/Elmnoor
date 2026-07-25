# تقرير اختبار موقع علم ونور

- **معرّف الالتزام:** 10473d0edb8156de65df71af5f3768435795423b
- **تاريخ الاختبار:** 14 مايو 2026
- **المختبِر:** الصياد

---

## نظام الحالات

| الحالة | المعنى / الإجراء المطلوب | وقت الإجراء |
| :-: | :-- | :-- |
| 💀 | **تعطّل الصفحة:** الصفحة غير متاحة، خطأ نظام النطاقات، أو استجابة 4 xx/5 xx | فوري |
| 🔴🔴 | **حرج:** خلل كبير أو ثغرة أمنية خطيرة تتطلب إصلاحًا فوريًا | < 24 ساعة |
| 🔴 | **تأثير عالي:** فشل مؤشرات Core Web Vitals أو مشاكل كبيرة في فهرسة تحسين البحث | 1-3 أيام |
| 🟡🟡 | **متوسط:** احتكاك في تجربة المستخدم وروابط معطلة وأو دين تقني كبير | أسبوع |
| 🟡 | **تحذير:** مخالفات بسيطة لأفضل الممارسات؛ مخاطر منخفضة | شهر |
| 🔵🔵 | **تحسين:** مهام استراتيجية لتحسين الترتيب أو السرعة | السباق القادم |
| 🔵 | **تعزيز:** تحسينات واجهة/تجربة المستخدم أو تعديلات نصية بسيطة | قائمة الانتظار |
| 🟢 | **ناجح:** يفي أو يتجاوز معايير الصناعة | مراقبة |
| ⏩ | **تخطي:** تم تخطي الأداة عمدًا (أضف السبب في الملاحظات) | الدورة القادمة |
| 🛑 | **لا وصول:** لا توجد صلاحيات أو مفاتيح واجهة برمجية لتشغيل الأداة | حل المشكلة |
| ⌛ | **يُنتظر:** النتائج لا تزال قيد المعالجة | متابعة |
| 🧊 | **لم يُختبر:** التقييم مخطط له لكنه لم يبدأ بعد | جدولة |

---

## الموقع: `elmnoor.com`

| الفئة | الدرجة الإجمالية | ملخص المشاكل الرئيسية |
| :-- | :-: | :-- |
| **النطاق** | 💀 | Netlify > Hostinger |

### 1. النطاق والاستضافة

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🔵 | | [Qualys SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=elmnoor.com) |
| 🟢 | | [HSTS Preload](https://hstspreload.org/?domain=elmnoor.com) |
| 🔵 | قد تُسبب القيمة `'self'` لـ `script-scr` مشاكل إذا كنت تستضيف ملفات JSONP أو AngularJS أو ملفات حملها مستخدم | [CSP Evaluator](https://csp-evaluator.withgoogle.com/) |
| 💀 | فشل المسح، انتهت مهلة الانتظار | [Sucuri SiteCheck](https://sitecheck.sucuri.net/results/https/elmnoor.com) |
| 🟢 | | [Seobility Redirect Checker](https://www.seobility.net/en/redirectcheck/check/?a_aid=n28lxtdlfqe9t&report&data1=ar&url=elmnoor.com&target=https%3A%2F%2F) |
| 🔵🔵 | | [Website Carbon Calculator](https://www.websitecarbon.com/website/elmnoor-com/) |

## الصفحة: `https://elmnoor.com/ar/`

| الفئة | الدرجة الإجمالية | ملخص المشاكل الرئيسية |
| :-- | :-: | :-- |
| **الأمان** | 🟢 | |
| **الأداء** | 🔵 | |
| **تحسين البحث** | 🔵 | |
| **تجربة المستخدم** | 🔵 | |

### 1. الأمان والسياسات

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🟢 | | [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=elmnoor.com) |
| 🟢 | ملف `security.txt` مفقود | [Pentest Tools Website Scanner](https://app.pentest-tools.com/website-vulnerability-scanning/website-scanner/scans/8gDRjDO0o0PbokB6?finished=true) |

### 2. الأداء والحجم

| الحالة | الجهاز | الموقع | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- | :-- | :-- |
| 🔵 | 📱 | ? | إنّ الحجم الكبير لنموذج العناصر في المستند (DOM) يمكن أن يؤدي إلى زيادة مدة عمليات احتساب الأنماط وإعادة تدفق التنسيقات، ما يؤثر في سرعة استجابة الصفحة. وسيزيد هذا الحجم الكبير أيضًا من استخدام الذاكرة | [Google PageSpeed Insights](https://pagespeed.web.dev/analysis/https-elmnoor-com-ar/8tuh5fwmy5?form_factor=mobile&hl=ar) |
| 🔵 | 📱 | أوروبا | | [WebPageTest](https://portal.catchpoint.com/ui/Symphony/InstantTest/Webpage/1149611/Details) |
| 🟢 | 📱 | ? | | [DebugBear INP Debugger](https://www.debugbear.com/inp-debugger/IW0nPG-tewhkt) |
| 🟢 | ? | ? | | [DebugBear Resource Hint Validator](https://www.debugbear.com/resource-hint-validator?url=https%3A%2F%2Felmnoor.com%2Far%2F) |
| 🔵 | ? | المملكة المتحدة | الضغط بـGZIP درجته 78/100 | [Pingdom Website Speed Test](https://tools.pingdom.com/#6789709522000000) |

### 3. تحسين محركات البحث

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🛑 | | [Ahrefs Site Audit](https://app.ahrefs.com/site-audit) |
| 🟢 | | [SEOptimer](https://www.seoptimer.com/elmnoor.com) |
| 🔵 | نقل ملفات الوسائط عبر شبكات التوزيع. تحميل صور بأحجام معينة | [SEO Site Checkup](https://seositecheckup.com/seo-audit/elmnoor.com/ar) |
| 🔵 | قلّل عدد ملفات CSS. يجب على كلمات محتوى H 1 مطابقة محتوى نصوص الصفحة | [Seobility SEO Checker](https://www.seobility.net/en/seocheck/check/?a_aid=n28lxtdlfqe9t&report&data1=ar&url=https%3A%2F%2Felmnoor.com%2Far%2F&mode=javascript) |
| 🟢 | | [Google Rich Results Test](https://search.google.com/test/rich-results?url=https%3A%2F%2Felmnoor.com%2Far%2F) |
| 🟢 | | [Nu Html Checker](https://validator.unl.edu/?showsource=yes&showoutline=yes&showimagereport=yes&checkerrorpages=yes&useragent=Validator.nu%2FLV&acceptlanguage=&doc=https%3A%2F%2Felmnoor.com%2Far%2F) |
| 🟢 | | [The W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Felmnoor.com%2Far%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) |
| 🟢 | | [Mangools SERP Simulator](https://mangools.com/free-seo-tools/serp-simulator#a6a05958b6aee0857c1f88814?u=https%3A%2F%2Felmnoor.com%2Far%2F&sn=Elm+w+Noor&t=%D8%B9%D9%84%D9%85+%D9%88%D9%86%D9%88%D8%B1+%7C+%D8%A7%D8%A8%D9%86%D9%83+%D9%81%D9%8A+%D8%A3%D9%8A%D8%AF%D9%8D+%D8%A3%D9%85%D9%8A%D9%86%D8%A9+%D9%81%D9%8A+%7C+%D8%AF%D9%84%D9%8A%D9%84+%D8%BA%D8%B1%D8%A8%D8%A9+%D9%85%D8%A7%D9%84%D9%8A%D8%B2%D9%8A%D8%A7+%D9%88%D8%AA%D8%B3%D8%AC%D9%8A%D9%84+%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A7%D8%AA&d=%D9%86%D8%B1%D8%B9%D9%89+%D8%A3%D8%A8%D9%86%D8%A7%D8%A1%D9%83%D9%85+%D8%AD%D8%AA%D9%89+%D8%B9%D9%88%D8%AF%D8%AA%D9%87%D9%85%3A+%D8%AF%D9%84%D9%8A%D9%84+%D8%BA%D8%B1%D8%A8%D8%A9+%D9%85%D8%A7%D9%84%D9%8A%D8%B2%D9%8A%D8%A7+%D9%88%D8%AA%D8%B3%D8%AC%D9%8A%D9%84+%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A7%D8%AA+%D9%88%D8%A7%D8%B3%D8%AA%D8%AE%D8%B1%D8%A7%D8%AC+%D8%A7%D9%84%D8%AA%D8%A3%D8%B4%D9%8A%D8%B1%D8%A9+%D9%88%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%82%D8%A8%D8%A7%D9%84+%D9%85%D9%86+%D8%A7%D9%84%D9%85%D8%B7%D8%A7%D8%B1+%D9%88%D8%A7%D9%84%D8%B3%D9%83%D9%86+%D8%A7%D9%84%D8%A2%D9%85%D9%86&fav=https%3A%2F%2Felmnoor.com%2Fimages%2Ffavicon-16.webp&sk=https%3A%2F%2Felmnoor.com%2Far%2F&vm=mobile&loc=2826&locCode=gb&locLabel=United+Kingdom) |

### 4. تجربة المستخدم والامتثال

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🟢 | | [Blacklight (The Markup)](https://themarkup.org/blacklight?url=https%3A%2F%2Felmnoor.com%2Far%2F&device=mobile&location=eu&force=true) |
| 🔵 | لا أمر للمستهلك في الصورة | [Open Graph Checker](https://www.opengraph.xyz/url/https%3A%2F%2Felmnoor.com%2F) |
| 🔵 | 3 تحذيرات | [WAVE Accessibility Tool](https://wave.webaim.org/report#/https://elmnoor.com/ar/) |
