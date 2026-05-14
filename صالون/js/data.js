import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";
import { formatDateISO, parseAppointmentDateTime } from "./app.js";

const MOCK_KEY = "salon_bookings_v1";

/** @typedef {'pending'|'confirmed'|'cancelled'} BookingStatus */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} customerName
 * @property {string} customerPhone
 * @property {string} serviceId
 * @property {string} staffId
 * @property {string} date
 * @property {string} time
 * @property {BookingStatus} status
 * @property {number[]} reminderOffsetsMinutes
 * @property {number|null} reminderCustomMinutes
 * @property {Record<string, string>} remindersSent
 * @property {string} createdAt
 * @property {string} appointmentAtISO
 */

let db = null;
let firestoreModule = null;
let bookingsCol = null;
let mode = "mock";

function mockRead() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function mockWrite(bookings) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(bookings));
}

export function getDataMode() {
  return mode;
}

export async function initDataLayer() {
  if (!isFirebaseConfigured()) {
    mode = "mock";
    return { mode };
  }
  try {
    firestoreModule = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
    );
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"
    );
    const app = initializeApp(firebaseConfig);
    db = firestoreModule.getFirestore(app);
    bookingsCol = firestoreModule.collection(db, "bookings");
    mode = "firestore";

    try {
      const analyticsMod = await import(
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js"
      );
      if (typeof window !== "undefined") {
        const supported =
          typeof analyticsMod.isSupported === "function"
            ? await analyticsMod.isSupported()
            : true;
        if (supported) analyticsMod.getAnalytics(app);
      }
    } catch {
      /* Analytics اختياري */
    }

    return { mode };
  } catch (e) {
    console.warn("Firebase init failed, using mock store:", e);
    mode = "mock";
    return { mode };
  }
}

function normalizeBooking(data, id) {
  return {
    id,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    serviceId: data.serviceId,
    staffId: data.staffId,
    date: data.date,
    time: data.time,
    status: data.status || "pending",
    reminderOffsetsMinutes: data.reminderOffsetsMinutes || [],
    reminderCustomMinutes:
      data.reminderCustomMinutes === undefined
        ? null
        : data.reminderCustomMinutes,
    remindersSent: data.remindersSent || {},
    createdAt: data.createdAt || new Date().toISOString(),
    appointmentAtISO: data.appointmentAtISO,
  };
}

/**
 * @param {Omit<Booking, 'id'|'createdAt'|'remindersSent'|'appointmentAtISO'> & Partial<Pick<Booking,'status'>>} input
 */
export async function addBooking(input) {
  const appointmentAt = parseAppointmentDateTime(input.date, input.time);
  const payload = {
    ...input,
    status: input.status || "pending",
    remindersSent: {},
    createdAt: new Date().toISOString(),
    appointmentAtISO: appointmentAt.toISOString(),
  };

  if (mode === "firestore") {
    const ref = await firestoreModule.addDoc(bookingsCol, payload);
    return normalizeBooking({ ...payload, id: ref.id }, ref.id);
  }

  const id = "mock_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  const booking = normalizeBooking({ ...payload, id }, id);
  const all = mockRead();
  all.push(booking);
  mockWrite(all);
  return booking;
}

export async function getAllBookings() {
  if (mode === "firestore") {
    const snap = await firestoreModule.getDocs(bookingsCol);
    /** @type {Booking[]} */
    const list = [];
    snap.forEach((d) => {
      list.push(normalizeBooking(d.data(), d.id));
    });
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return mockRead().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** @param {string} id @param {Partial<Booking>} patch */
export async function updateBooking(id, patch) {
  if (mode === "firestore") {
    const ref = firestoreModule.doc(db, "bookings", id);
    const next = { ...patch };
    if (patch.date && patch.time) {
      next.appointmentAtISO = parseAppointmentDateTime(
        patch.date,
        patch.time
      ).toISOString();
    }
    await firestoreModule.updateDoc(ref, next);
    return;
  }
  const all = mockRead();
  const i = all.findIndex((b) => b.id === id);
  if (i === -1) return;
  all[i] = {
    ...all[i],
    ...patch,
    ...(patch.date && patch.time
      ? {
          appointmentAtISO: parseAppointmentDateTime(
            patch.date,
            patch.time
          ).toISOString(),
        }
      : {}),
  };
  mockWrite(all);
}

/**
 * @param {string} dateISO
 * @param {string} staffId
 * @param {string} [excludeBookingId]
 */
export async function getBookedSlots(dateISO, staffId, excludeBookingId) {
  const all = await getAllBookings();
  return all
    .filter(
      (b) =>
        b.date === dateISO &&
        b.staffId === staffId &&
        b.status !== "cancelled" &&
        b.id !== excludeBookingId
    )
    .map((b) => b.time);
}

/**
 * @param {(bookings: Booking[]) => void} callback
 * @returns {() => void}
 */
export function subscribeBookings(callback) {
  if (mode === "firestore" && bookingsCol) {
    const unsub = firestoreModule.onSnapshot(bookingsCol, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(normalizeBooking(d.data(), d.id)));
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(list);
    });
    return unsub;
  }

  const tick = () => callback(mockRead());
  tick();
  const iv = setInterval(tick, 2000);
  return () => clearInterval(iv);
}
