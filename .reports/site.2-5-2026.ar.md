# تقرير اختبار موقع علم ونور

- **معرّف الالتزام:** 1bc04c32227a881000371be03a5e6103ee87a30d
- **تاريخ الاختبار:** 2 مايو 2026
- **المختبِر:** الصياد

---

## نظام الحالات

| الحالة | المعنى / الإجراء المطلوب | وقت الإجراء |
| :-: | :-- | :-- |
| 💀 | **تعطّل الصفحة:** الصفحة غير متاحة، خطأ نظام النطاقات، أو استجابة 4 xx/5 xx | فوري |
| 🔴🔴 | **حرج:** خلل كبير أو ثغرة أمنية خطيرة تتطلب إصلاحًا فوريًا | < 24 ساعة |
| 🔴 | **تأثير عالي:** فشل مؤشرات Core Web Vitals أو مشاكل كبيرة في فهرسة تحسين البحث | 1-3 أيام |
| 🟡🟡 | **متوسط:** احتكاك في تجربة المستخدم، روابط معطلة، أو دين تقني كبير | أسبوع |
| 🟡 | **تحذير:** مخالفات بسيطة لأفضل الممارسات؛ مخاطر منخفضة | شهر |
| 🔵🔵 | **تحسين:** مهام استراتيجية لتحسين الترتيب أو السرعة | السباق القادم |
| 🔵 | **تعزيز:** تحسينات واجهة/تجربة المستخدم أو تعديلات نصية بسيطة | قائمة الانتظار |
| 🟢 | **ناجح:** يفي أو يتجاوز معايير الصناعة | مراقبة |
| ⏩ | **أُجتيز:** تم تخطي الأداة عمدًا (أضف السبب في الملاحظات) | الدورة القادمة |
| 🛑 | **لا وصول:** لا توجد صلاحيات أو مفاتيح API لتشغيل الأداة | حل المشكلة |
| ⌛ | **يُنتظر:** النتائج لا تزال قيد المعالجة | متابعة |
| 🧊 | **تخطي:** التقييم مخطط له لكنه لم يبدأ بعد | جدولة |

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
| 🔴 | تسمح الخاصية `unsafe-inline` بتنفيذ البرامج النصية غير الآمنة داخل الصفحة ومعالجات الأحداث | [CSP Evaluator](https://csp-evaluator.withgoogle.com/) |
| 💀 | فشل المسح، انتهت مهلة الانتظار | [Sucuri SiteCheck](https://sitecheck.sucuri.net/results/https/elmnoor.com) |
| 🔴🔴 | لا تكوين لإعادة التوجيه | [Seobility Redirect Checker](https://www.seobility.net/en/redirectcheck/check/?a_aid=n28lxtdlfqe9t&report&data1=ar&url=elmnoor.com&target=https%3A%2F%2F) |
| 🔴🔴 | تم إدراج العنوان في القائمة السوداء بواسطة UCEPROTECTL 3، وسياسة الحجر الصحي/الرفض الخاصة بـ DMARC غير مفعلة | [MXToolbox Email Health](https://mxtoolbox.com/emailhealth/elmnoor.com/) |
| 🔵🔵 | | [Website Carbon Calculator](https://www.websitecarbon.com/website/elmnoor-com/) |

## الصفحة: `https://elmnoor.com/`

| الفئة | الدرجة الإجمالية | ملخص المشاكل الرئيسية |
| :-- | :-: | :-- |
| **الأمان** | 🟡 | |
| **الأداء** | 🔴🔴 | |
| **تحسين البحث** | 🔴 | جد حلا لصفحة "علوم الحاسوب" وروابطها |
| **تجربة المستخدم** | 🔴 | |

### 1. الأمان والسياسات

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🟡 | إزالة `unsafe-inline` و `data:` من `script-src` ، والمصادر المفرطة في اتساع نطاقها من `object-src` و `script-src` ، والتأكد من تعيين `object-src` و `script-src` | [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=elmnoor.com) |
| 🔵 | object-src: نوصي بتقييد قيمة object-src إلى "none". Script-src: تسمح القيمة "unsafe-inline" بتنفيذ البرامج النصية غير الآمنة داخل الصفحة ومعالجات الأحداث. Script-src: قد تتسبب القيمة "self" في مشاكل إذا كنت تستضيف ملفات JSONP أو Angular أو ملفات تم تحميلها من قبل المستخدمين | [Pentest Tools Website Scanner](https://app.pentest-tools.com/website-vulnerability-scanning/website-scanner/scans/29dXbPXgg41bNnpB) |

### 2. الأداء والحجم

| الحالة | الجهاز | الموقع | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- | :-- | :-- |
| 🔴🔴 | 📱 | ? | تقليل حجم الصور وتحميلها بشكل مؤجل، وتعيين خيار "font-display" على "swap"، وإزالة الأغنية، وإزالة "Google Tag Manager" | [Google PageSpeed Insights](https://pagespeed.web.dev/analysis/https-elmnoor-com/yz6tr25vmm?form_factor=mobile&hl=ar) |
| 🔴 | 📱 | إيطاليا | استغرق تحميل ملفات الصور وملفات JS وقتًا طويلاً؛ فقد استغرق تحميل صورة "micky" 1600 مللي ثانية، واستغرق تحميل الأغنية 2500 مللي ثانية، كما تأخر كل من Google Tag Manager وGoogle Analytics وGoogle Fonts وCloudflare CDN في إقامة الاتصال، لذا احتفظ بخط "Changa" فقط | [WebPageTest](https://portal.catchpoint.com/ui/Symphony/InstantTest/Webpage/1076630/Details) |
| 🟢 | 📱 | ? | | [DebugBear INP Debugger](https://www.debugbear.com/inp-debugger/PqOent-teedyr) |
| 🔴 | ? | ? | استخدم السمة crossorigin="use-credentials" لموقع `fonts.gstatic.com`. احذف السمة crossorigin لموقع `cdnjs.cloudflare.com`. احذف التلميح الخاص بـ `images/og-cover.webp`. يبلغ حجم ملف `images/anim.webp` 414 كيلوبايت | [DebugBear Resource Hint Validator](https://www.debugbear.com/resource-hint-validator?url=https%3A%2F%2Felmnoor.com%2F) |
| 🟡🟡 | ? | UK | ضغط المكونات باستخدام gzip، وإضافة رؤوس Expires | [Pingdom Website Speed Test](https://tools.pingdom.com/#6779e6a877400000) |

### 3. تحسين محركات البحث

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🛑 | | [Ahrefs Site Audit](https://app.ahrefs.com/site-audit) |
| 🟡🟡 | تقليص طول العنوان والوصف، وزيادة نص الصفحة، وتطبيق ملف llms. Txt، وإضافة المزيد من الكلمات المفتاحية | [SEOptimer](https://www.seoptimer.com/elmnoor.com) |
| 🟡🟡 | توحيد عناوين URL، وإدراج الكلمات المفتاحية الأكثر شيوعًا في علامة العنوان ووصف meta وعلامات العناوين، وتعديل دقة الصورة مع النسخة المعروضة | [SEO Site Checkup](https://seositecheckup.com/seo-audit/elmnoor.com) |
| 🟡🟡 | | [Seobility SEO Checker](https://www.seobility.net/en/seocheck/check/?a_aid=n28lxtdlfqe9t&report&data1=ar&url=$$UNENCODED-URL$$) |
| 🟢 | | [Google Rich Results Test](https://search.google.com/test/rich-results/result?id=-fbQpuUfL5AWLFEGqFP0sQ) |
| 🔴 | يوجد حرف غير صالح في جزء المسار. لا يُسمح بوجود مسافة، قم بإزالة عناصر HTML غير الضرورية | [Nu Html Checker](https://validator.w3.org/nu/?doc=https%3A%2F%2Felmnoor.com%2F) |
| 🔴 | الخاصية `contain-intrinsic-size` غير موجودة، والخاصية `clip` مهملة، قم بإزالة امتدادات الموردين (القيم التي تبدأ بـ `-`)، والقيمة `auto` غير محددة في أي مواصفة كقيمة مسموح بها لـ `pointer-events` | [The W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Felmnoor.com%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) |

### 4. تجربة المستخدم والامتثال

| الحالة | ملاحظات المختبِر | الأداة |
| :-- | :-- | :-- |
| 🔵 | Google Analytics/مدير العلامات | [Blacklight (The Markup)](https://themarkup.org/blacklight?url=https%3A%2F%2Felmnoor.com%2F&device=mobile&location=eu&force=false) |
| 🟡 | أبعاد الصورة هي 1280×714 بكسل بدلاً من 1200×630 بكسل، ولا يوجد زر دعوة لاتخاذ إجراء في الصورة | [Open Graph Checker](https://www.opengraph.xyz/url/https%3A%2F%2Felmnoor.com%2F) |
| 🔴 | 8 عناصر ذات تباين منخفض، 6 تنبيهات | [WAVE Accessibility Tool](https://wave.webaim.org/report#/https://elmnoor.com/) |
