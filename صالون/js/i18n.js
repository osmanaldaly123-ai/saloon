const STORAGE_KEY = "salon_lang";

/** @type {Record<string, Record<string, string>>} */
const STRINGS = {
  ar: {
    "doc.indexTitle": "صالون الجمال — تجربة فاخرة",
    "doc.bookingTitle": "حجز موعد — صالون الجمال",
    "doc.adminTitle": "لوحة الإدارة — صالون الجمال",
    "top.admin": "لوحة الإدارة",
    "top.lang": "اللغة",

    "nav.services": "الخدمات",
    "nav.reviews": "التقييمات",
    "nav.book": "احجزي موعدك",
    "nav.home": "الرئيسية",
    "nav.bookingPage": "صفحة الحجز",

    "brand.name": "صالون الجمال",
    "brand.tag": "جمال · أناقة · رفاهية",
    "brand.tagBooking": "حجز موعد",
    "brand.adminName": "لوحة الإدارة",
    "brand.adminTag": "صالون الجمال",

    "hero.title": "دلّلي نفسك بتجربة جمال فاخرة",
    "hero.lead":
      "أقل من ٣٠ ثانية لحجز موعدكِ — فريق محترف، أجواء هادئة، وتفاصيل تليق بكِ.",
    "hero.cta1": "احجزي موعدك الآن ✨",
    "hero.cta2": "استكشفي الخدمات",
    "hero.badge": "✨ تجربة سبا فاخرة",

    "slider.hair": "قصات شعر عصرية",
    "slider.nails": "أظافر أنيقة",
    "slider.skin": "بشرة ناعمة ورطبة",
    "slider.lashes": "رموش كثيفة وجذابة",
    "slider.brows": "تخطيط وتنسيق حواجب",

    "services.title": "خدماتنا المميزة",
    "services.sub": "اختاري ما يناسبكِ — مدد تقريبية وأسعار تُعرض في الصالون.",
    "svc.haircut": "قص شعر ✂️",
    "svc.color": "صبغة 🎨",
    "svc.protein": "بروتين 💆‍♀️",
    "svc.skincare": "تنظيف بشرة ✨",
    "svc.dur.haircut": "حوالي ٤٥ دقيقة",
    "svc.dur.color": "حوالي ساعتان",
    "svc.dur.protein": "حوالي ٣ ساعات",
    "svc.dur.skincare": "حوالي ٦٠ دقيقة",
    "svc.pick": "اختيار",

    "reviews.title": "ماذا قالت عميلاتنا",
    "reviews.sub": "تجارب حقيقية من زياراتكن لنا",
    "rev.1": "«أجواء راقية وخدمة سريعة، الحجز أونلاين وفر عليّ الوقت كثيراً.»",
    "rev.2": "«نورة خبيرة صبغات بمعنى الكلمة، النتيجة فوق التوقعات.»",
    "rev.3": "«تنظيف البشرة مع ريم كان لطيفاً جداً، بشرتي صارت أنعم.»",
    "rev.a1": "— ليان",
    "rev.a2": "— هديل",
    "rev.a3": "— نورة",

    "footer.copy": "© صالون الجمال — جميع الحقوق محفوظة",
    "footer.mini": "صالون الجمال",
    "footer.admin": "لوحة الإدارة — للاستخدام الداخلي",

    "booking.heroTitle": "احجزي موعدكِ",
    "booking.heroSub":
      "خطوات بسيطة — اختاري الخدمة، الموظفة، الوقت، وتفضيلات التذكير.",
    "booking.step1": "بياناتك",
    "booking.step2": "الخدمة",
    "booking.step3": "الموظفة",
    "booking.step4": "التاريخ والوقت",
    "booking.step5": "التذكير",
    "booking.panel0": "١ — بياناتك",
    "booking.panel1": "٢ — الخدمة",
    "booking.panel2": "٣ — اختيار الموظفة",
    "booking.panel2sub":
      "اخترِ من تنفّذ الخدمة — كل فردة فريقنا بخبرة مختلفة.",
    "booking.panel3": "٤ — التاريخ والوقت",
    "booking.panel4": "٥ — التذكير",
    "booking.label.name": "الاسم",
    "booking.label.phone": "رقم الهاتف",
    "booking.ph.name": "مثال: سارة",
    "booking.ph.phone": "05xxxxxxxx",
    "booking.label.date": "التاريخ",
    "booking.label.time": "الوقت",
    "booking.slotsHint": "الأوقات الرمادية محجوزة مسبقاً لنفس الموظفة.",
    "booking.slotsEmpty": "اخترِ التاريخ والموظفة لعرض الأوقات.",
    "booking.reminderIntro":
      "اختاري متى تصلكِ إشعارات التذكير (يُحفظ مع الحجز). لاحقاً يمكن ربط واتساب أو SMS عبر API.",
    "booking.rem24": "قبل ٢٤ ساعة",
    "booking.rem12": "قبل ١٢ ساعة",
    "booking.rem60": "قبل ساعة",
    "booking.rem30": "قبل ٣٠ دقيقة",
    "booking.remCustom": "تذكير مخصص (بالدقائق قبل الموعد)",
    "booking.remCustomHint": "اتركيها فارغة إن لم ترغبي بوقت إضافي",
    "booking.remPh": "مثال: 180",
    "booking.prev": "السابق",
    "booking.next": "التالي",
    "booking.confirm": "تأكيد الحجز ✨",
    "booking.duration": "المدة التقريبية",
    "booking.choose": "اختيار",
    "booking.err.name": "يرجى إدخال الاسم ورقم الهاتف.",
    "booking.err.service": "اخترِ خدمة من القائمة.",
    "booking.err.staff": "اخترِ الموظفة المفضّلة.",
    "booking.err.date": "اخترِ يوم الموعد.",
    "booking.err.time": "اخترِ وقت الموعد.",
    "booking.err.reminder":
      "اخترِ وقت تذكير واحد على الأقل، أو أدخلي تذكيراً مخصصاً بالدقائق.",
    "booking.saveErr":
      "تعذّر حفظ الحجز. حاولي لاحقاً أو تحققي من إعدادات Firebase.",
    "booking.banner.mock":
      "وضع تجريبي: الحجوزات تُحفظ محلياً في المتصفح. لتفعيل السحابة، عدّلي ملف firebase-config.js",
    "booking.banner.live": "متصل بـ Firebase — صالون الجمال",
    "booking.cal.prev": "الشهر السابق",
    "booking.cal.next": "الشهر التالي",
    "cal.0": "أحد",
    "cal.1": "اثنين",
    "cal.2": "ثلاثاء",
    "cal.3": "أربعاء",
    "cal.4": "خميس",
    "cal.5": "جمعة",
    "cal.6": "سبت",

    "booking.conf.title": "تم تأكيد حجزك بنجاح",
    "booking.conf.name": "الاسم",
    "booking.conf.service": "الخدمة",
    "booking.conf.staff": "الموظفة",
    "booking.conf.date": "التاريخ",
    "booking.conf.time": "الوقت",
    "booking.conf.msg": "ننتظركِ في موعدكِ، استعدي لتجربة فاخرة ✨",
    "booking.conf.home": "العودة للرئيسية",

    "staff.noura.title": "خبيرة صبغات",
    "staff.sara.title": "قصات عصرية",
    "staff.reem.title": "عناية بالبشرة",

    "admin.heroTitle": "لوحة تحكم الصالون",
    "admin.heroSub":
      "إحصائيات سريعة، إدارة الحجوزات، ومعاينة التذكيرات (وضع تجريبي للإشعارات).",
    "admin.banner.mock": "لوحة الإدارة — وضع تجريبي (محلي)",
    "admin.banner.live": "لوحة الإدارة — صالون الجمال (Firebase)",
    "admin.stat.today": "حجوزات اليوم",
    "admin.stat.up": "المواعيد القادمة",
    "admin.stat.top": "أكثر خدمة طلباً",
    "admin.notify": "تفعيل إشعارات المتصفح للتذكيرات",
    "admin.notify.ok": "مفعّل ✓",
    "admin.notify.denied": "مرفوض",
    "admin.notify.unsupported": "غير مدعوم",
    "admin.th.client": "العميلة",
    "admin.th.service": "الخدمة",
    "admin.th.staff": "الموظفة",
    "admin.th.date": "التاريخ",
    "admin.th.time": "الوقت",
    "admin.th.status": "الحالة",
    "admin.th.actions": "إجراءات",
    "admin.act.confirm": "تأكيد",
    "admin.act.cancel": "إلغاء",
    "admin.act.resched": "تغيير الوقت",
    "admin.st.confirmed": "✔ مؤكد",
    "admin.st.cancelled": "❌ ملغي",
    "admin.st.pending": "⏳ قادم",
    "admin.log.offsetLabel": "دقيقة قبل الموعد",
    "admin.log.sub":
      "عند اقتراب موعد التذكير يُعرض النص هنا. للإنتاج: استخدمي Cloud Functions + Twilio أو WhatsApp Business API.",
    "admin.modal.title": "تغيير وقت الموعد",
    "admin.modal.date": "التاريخ",
    "admin.modal.time": "الوقت",
    "admin.modal.cancel": "إلغاء",
    "admin.modal.save": "حفظ",
  },
  en: {
    "doc.indexTitle": "Beauty Salon — Luxury experience",
    "doc.bookingTitle": "Book an appointment — Beauty Salon",
    "doc.adminTitle": "Admin — Beauty Salon",
    "top.admin": "Admin dashboard",
    "top.lang": "Language",

    "nav.services": "Services",
    "nav.reviews": "Reviews",
    "nav.book": "Book now",
    "nav.home": "Home",
    "nav.bookingPage": "Booking",

    "brand.name": "Beauty Salon",
    "brand.tag": "Beauty · Elegance · Wellness",
    "brand.tagBooking": "Booking",
    "brand.adminName": "Admin",
    "brand.adminTag": "Beauty Salon",

    "hero.title": "Treat yourself to a luxury beauty experience",
    "hero.lead":
      "Book in under 30 seconds — expert team, calm ambiance, and refined details.",
    "hero.cta1": "Book your visit ✨",
    "hero.cta2": "Explore services",
    "hero.badge": "✨ Spa-inspired experience",

    "slider.hair": "Modern haircuts & styling",
    "slider.nails": "Elegant nail art",
    "slider.skin": "Soft, glowing skin",
    "slider.lashes": "Full, beautiful lashes",
    "slider.brows": "Brow mapping & shaping",

    "services.title": "Signature services",
    "services.sub": "Choose what suits you — durations are approximate; pricing at the salon.",
    "svc.haircut": "Haircut ✂️",
    "svc.color": "Hair color 🎨",
    "svc.protein": "Protein treatment 💆‍♀️",
    "svc.skincare": "Facial / skincare ✨",
    "svc.dur.haircut": "~45 minutes",
    "svc.dur.color": "~2 hours",
    "svc.dur.protein": "~3 hours",
    "svc.dur.skincare": "~60 minutes",
    "svc.pick": "Select",

    "reviews.title": "Client reviews",
    "reviews.sub": "Real feedback from recent visits",
    "rev.1": "“Chic vibe and fast service — online booking saved me so much time.”",
    "rev.2": "“Noura is a true color expert — results exceeded expectations.”",
    "rev.3": "“Reem’s facial was so gentle — my skin feels smoother.”",
    "rev.a1": "— Layan",
    "rev.a2": "— Hadeel",
    "rev.a3": "— Nora",

    "footer.copy": "© Beauty Salon — All rights reserved",
    "footer.mini": "Beauty Salon",
    "footer.admin": "Admin — internal use",

    "booking.heroTitle": "Book your appointment",
    "booking.heroSub":
      "A few simple steps — service, stylist, time, and reminder preferences.",
    "booking.step1": "Your details",
    "booking.step2": "Service",
    "booking.step3": "Stylist",
    "booking.step4": "Date & time",
    "booking.step5": "Reminders",
    "booking.panel0": "1 — Your details",
    "booking.panel1": "2 — Service",
    "booking.panel2": "3 — Choose your stylist",
    "booking.panel2sub":
      "Pick who performs your service — each team member has a specialty.",
    "booking.panel3": "4 — Date & time",
    "booking.panel4": "5 — Reminders",
    "booking.label.name": "Name",
    "booking.label.phone": "Phone",
    "booking.ph.name": "e.g. Sara",
    "booking.ph.phone": "05xxxxxxxx",
    "booking.label.date": "Date",
    "booking.label.time": "Time",
    "booking.slotsHint": "Grey slots are already booked for this stylist.",
    "booking.slotsEmpty": "Pick a date and stylist to see available times.",
    "booking.reminderIntro":
      "Choose when you want reminders (saved with your booking). WhatsApp/SMS can be connected later via API.",
    "booking.rem24": "24 hours before",
    "booking.rem12": "12 hours before",
    "booking.rem60": "1 hour before",
    "booking.rem30": "30 minutes before",
    "booking.remCustom": "Custom reminder (minutes before)",
    "booking.remCustomHint": "Leave empty if you don’t want an extra reminder",
    "booking.remPh": "e.g. 180",
    "booking.prev": "Back",
    "booking.next": "Next",
    "booking.confirm": "Confirm booking ✨",
    "booking.duration": "Approx. duration",
    "booking.choose": "Select",
    "booking.err.name": "Please enter your name and phone.",
    "booking.err.service": "Please select a service.",
    "booking.err.staff": "Please select a stylist.",
    "booking.err.date": "Please choose an appointment day.",
    "booking.err.time": "Please choose a time slot.",
    "booking.err.reminder":
      "Pick at least one reminder, or enter a custom reminder in minutes.",
    "booking.saveErr":
      "Could not save the booking. Try again or check Firebase settings.",
    "booking.banner.mock":
      "Demo mode: bookings are stored locally in the browser. Edit firebase-config.js to use the cloud.",
    "booking.banner.live": "Connected to Firebase — Beauty Salon",
    "booking.cal.prev": "Previous month",
    "booking.cal.next": "Next month",
    "cal.0": "Sun",
    "cal.1": "Mon",
    "cal.2": "Tue",
    "cal.3": "Wed",
    "cal.4": "Thu",
    "cal.5": "Fri",
    "cal.6": "Sat",

    "booking.conf.title": "Your booking is confirmed",
    "booking.conf.name": "Name",
    "booking.conf.service": "Service",
    "booking.conf.staff": "Stylist",
    "booking.conf.date": "Date",
    "booking.conf.time": "Time",
    "booking.conf.msg": "We can’t wait to see you — get ready for a luxury experience ✨",
    "booking.conf.home": "Back to home",

    "staff.noura.title": "Color specialist",
    "staff.sara.title": "Modern cuts",
    "staff.reem.title": "Skincare expert",

    "admin.heroTitle": "Salon dashboard",
    "admin.heroSub":
      "Quick stats, booking management, and reminder previews (notifications are demo).",
    "admin.banner.mock": "Admin — demo mode (local storage)",
    "admin.banner.live": "Admin — Beauty Salon (Firebase)",
    "admin.stat.today": "Today’s bookings",
    "admin.stat.up": "Upcoming",
    "admin.stat.top": "Top service",
    "admin.notify": "Enable browser notifications",
    "admin.notify.ok": "Enabled ✓",
    "admin.notify.denied": "Blocked",
    "admin.notify.unsupported": "Not supported",
    "admin.th.client": "Client",
    "admin.th.service": "Service",
    "admin.th.staff": "Stylist",
    "admin.th.date": "Date",
    "admin.th.time": "Time",
    "admin.th.status": "Status",
    "admin.th.actions": "Actions",
    "admin.act.confirm": "Confirm",
    "admin.act.cancel": "Cancel",
    "admin.act.resched": "Reschedule",
    "admin.st.confirmed": "✔ Confirmed",
    "admin.st.cancelled": "❌ Cancelled",
    "admin.st.pending": "⏳ Upcoming",
    "admin.log.offsetLabel": "min before visit",
    "admin.log.sub":
      "When a reminder window hits, the draft message appears here. For production, use Cloud Functions + Twilio or WhatsApp Business API.",
    "admin.modal.title": "Reschedule appointment",
    "admin.modal.date": "Date",
    "admin.modal.time": "Time",
    "admin.modal.cancel": "Close",
    "admin.modal.save": "Save",
  },
};

export function getLang() {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "en" ? "en" : "ar";
}

/** @param {'ar'|'en'} lang */
export function setLang(lang) {
  if (lang !== "ar" && lang !== "en") return;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("salon:lang", { detail: { lang } }));
}

/** @param {string} key */
export function t(key) {
  const lang = getLang();
  const table = STRINGS[lang] || STRINGS.ar;
  return table[key] ?? STRINGS.ar[key] ?? key;
}

function applyDom() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key || !("placeholder" in el)) return;
    el.placeholder = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });
}

/** إعادة تطبيق النصوص الثابتة بعد تحديث DOM ديناميكياً */
export function applyTranslations() {
  applyDom();
  syncLangButtons();
}

function syncLangButtons() {
  const lang = getLang();
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    const v = btn.getAttribute("data-set-lang");
    const active = v === lang;
    btn.classList.toggle("lang-btn--active", active);
  });
}

/** @param {{ titleKey?: string }} [options] */
export function initI18n(options = {}) {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.onclick = () => {
      const v = btn.getAttribute("data-set-lang");
      if (v === "ar" || v === "en") {
        setLang(v);
        applyTranslations();
        if (options.titleKey) document.title = t(options.titleKey);
      }
    };
  });

  applyTranslations();
  if (options.titleKey) document.title = t(options.titleKey);
}
