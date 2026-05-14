/** إعدادات الصالون المشتركة */
export const SALON_NAME = "صالون الجمال";

export const SERVICES = [
  {
    id: "haircut",
    name: "قص شعر",
    emoji: "✂️",
    duration: "٤٥ دقيقة",
    durationMin: 45,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80",
  },
  {
    id: "color",
    name: "صبغة",
    emoji: "🎨",
    duration: "٢ ساعة",
    durationMin: 120,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  },
  {
    id: "protein",
    name: "بروتين",
    emoji: "💆‍♀️",
    duration: "٣ ساعات",
    durationMin: 180,
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
  },
  {
    id: "skincare",
    name: "تنظيف بشرة",
    emoji: "✨",
    duration: "٦٠ دقيقة",
    durationMin: 60,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed8d881?w=400&q=80",
  },
];

export const STAFF = [
  {
    id: "noura",
    name: "نورة",
    title: "خبيرة صبغات",
    rating: "٤٫٩ ⭐",
    ratingNum: 4.9,
    image: "https://i.pravatar.cc/200?img=45",
  },
  {
    id: "sara",
    name: "سارة",
    title: "قصات عصرية",
    rating: "٤٫٨ ⭐",
    ratingNum: 4.8,
    image: "https://i.pravatar.cc/200?img=47",
  },
  {
    id: "reem",
    name: "ريم",
    title: "عناية بالبشرة",
    rating: "٥ ⭐",
    ratingNum: 5,
    image: "https://i.pravatar.cc/200?img=32",
  },
];

const PAD = (n) => String(n).padStart(2, "0");

/** @param {Date} d */
export function formatDateISO(d) {
  return `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}`;
}

/** دمج التاريخ وسلسلة الوقت "HH:mm" (٢٤ ساعة) */
export function parseAppointmentDateTime(dateISO, time24) {
  const [y, m, day] = dateISO.split("-").map(Number);
  const [hh, mm] = time24.split(":").map(Number);
  return new Date(y, m - 1, day, hh, mm, 0, 0);
}

/** توليد أوقات كل ٣٠ دقيقة من ٩:٠٠ إلى ١٧:٣٠ */
export function generateTimeSlots() {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    for (const min of [0, 30]) {
      if (h === 17 && min === 30) break;
      const hour24 = h;
      const m = min;
      const label = formatTimeLabel(hour24, m);
      slots.push({ value: `${PAD(hour24)}:${PAD(m)}`, label });
    }
  }
  return slots;
}

function formatTimeLabel(h24, m) {
  const am = h24 < 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const suf = am ? "AM" : "PM";
  return `${h12}:${PAD(m)} ${suf}`;
}

export function getServiceById(id) {
  return SERVICES.find((s) => s.id === id) || null;
}

export function getStaffById(id) {
  return STAFF.find((s) => s.id === id) || null;
}
