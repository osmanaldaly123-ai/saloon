import { SALON_NAME, getServiceById, getStaffById } from "./app.js";
import { updateBooking } from "./data.js";

const WINDOW_MS = 12 * 60 * 1000;

/**
 * @param {import('./data.js').Booking} booking
 * @param {string} offsetKey
 */
export function buildWhatsAppMessage(booking, offsetKey, phase) {
  const service = getServiceById(booking.serviceId);
  const staff = getStaffById(booking.staffId);
  const svc = service ? service.name : booking.serviceId;
  const st = staff ? staff.name : booking.staffId;
  const name = booking.customerName;
  const off = Number(offsetKey) || 0;

  if (off >= 720 || phase === "day_before") {
    return `مرحباً ${name} 💖\nتذكير بموعدكِ قريباً في ${SALON_NAME}\nالخدمة: ${svc}\nمع: ${st}\nالتاريخ: ${booking.date} — ${formatDisplayTime(booking)}`;
  }
  return `نراكِ قريباً ✨ ${name}\nيرجى الوصول في الوقت المحدد لموعدكِ في ${SALON_NAME}\n${svc} — ${formatDisplayTime(booking)}`;
}

function formatDisplayTime(booking) {
  const [hh, mm] = booking.time.split(":").map(Number);
  const am = hh < 12;
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  const suf = am ? "صباحاً" : "مساءً";
  return `${h12}:${String(mm).padStart(2, "0")} ${suf}`;
}

/**
 * يفحص الحجوزات ويُرسل إشعار المتصفح + يُسجّل الإرسال.
 * لاحقاً: اربطي sendToWhatsApp عبر API خادمي أو Twilio / Meta Cloud API.
 *
 * @param {import('./data.js').Booking[]} bookings
 * @param {(title: string, body: string, meta: object) => void} [onNotify]
 */
export async function processReminders(bookings, onNotify) {
  const now = Date.now();
  const log = [];

  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    const appt = new Date(b.appointmentAtISO).getTime();
    if (Number.isNaN(appt)) continue;

    const offsets = uniqueOffsets(b);
    const sent = { ...(b.remindersSent || {}) };

    for (const offMin of offsets) {
      const key = String(offMin);
      if (sent[key]) continue;

      const fireAt = appt - offMin * 60 * 1000;
      if (now >= fireAt && now < fireAt + WINDOW_MS) {
        const dayBefore = offMin >= 720;
        const phase = dayBefore ? "day_before" : "hour_before";
        const body = buildWhatsAppMessage(b, key, phase);
        const title = `${SALON_NAME} — تذكير`;

        if (onNotify) onNotify(title, body, { bookingId: b.id, offset: offMin });
        else if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification(title, { body, lang: "ar" });
          } catch {
            /* ignore */
          }
        }

        sent[key] = new Date().toISOString();
        log.push({ bookingId: b.id, offsetMin: offMin, body });

        await updateBooking(b.id, { remindersSent: sent });
        b.remindersSent = sent;
      }
    }
  }

  return log;
}

function uniqueOffsets(booking) {
  const raw = [...(booking.reminderOffsetsMinutes || [])];
  if (
    booking.reminderCustomMinutes != null &&
    booking.reminderCustomMinutes > 0 &&
    !raw.includes(booking.reminderCustomMinutes)
  ) {
    raw.push(booking.reminderCustomMinutes);
  }
  return [...new Set(raw)].filter((n) => n > 0);
}

export function requestNotificationPermission() {
  if (typeof Notification === "undefined") return Promise.resolve("unsupported");
  if (Notification.permission === "granted") return Promise.resolve("granted");
  return Notification.requestPermission();
}
