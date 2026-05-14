import { SERVICES, STAFF, generateTimeSlots } from "./app.js";
import { initDataLayer, subscribeBookings, updateBooking } from "./data.js";
import { processReminders, requestNotificationPermission } from "./reminders.js";
import { initI18n, t, applyTranslations } from "./i18n.js";

const timeSlots = generateTimeSlots();

function qs(id) {
  return document.getElementById(id);
}

function serviceName(id) {
  const key = `svc.${id}`;
  const tx = t(key);
  return tx !== key ? tx : SERVICES.find((s) => s.id === id)?.name || id;
}

function staffName(id) {
  return STAFF.find((s) => s.id === id)?.name || id;
}

function statusBadge(status) {
  if (status === "confirmed")
    return `<span class="badge badge-confirmed">${t("admin.st.confirmed")}</span>`;
  if (status === "cancelled")
    return `<span class="badge badge-cancelled">${t("admin.st.cancelled")}</span>`;
  return `<span class="badge badge-pending">${t("admin.st.pending")}</span>`;
}

function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function renderStats(bookings) {
  const todayStr = todayISO();
  const today = bookings.filter((b) => b.date === todayStr && b.status !== "cancelled");
  const upcoming = bookings.filter((b) => {
    const ap = new Date(b.appointmentAtISO).getTime();
    return !Number.isNaN(ap) && ap >= Date.now() && b.status !== "cancelled";
  });
  const counts = {};
  bookings.forEach((b) => {
    if (b.status === "cancelled") return;
    counts[b.serviceId] = (counts[b.serviceId] || 0) + 1;
  });
  let top = null;
  let topN = 0;
  Object.entries(counts).forEach(([k, v]) => {
    if (v > topN) {
      top = k;
      topN = v;
    }
  });

  qs("stat-today").textContent = String(today.length);
  qs("stat-upcoming").textContent = String(upcoming.length);
  qs("stat-top").textContent = top ? serviceName(top) : "—";
}

function renderTable(bookings) {
  const tbody = qs("bookings-body");
  if (!tbody) return;

  tbody.innerHTML = bookings
    .map((b) => {
      const slotLabel =
        timeSlots.find((slot) => slot.value === b.time)?.label || b.time;
      return `<tr>
        <td>${b.customerName}</td>
        <td>${serviceName(b.serviceId)}</td>
        <td>${staffName(b.staffId)}</td>
        <td>${b.date}</td>
        <td>${slotLabel}</td>
        <td>${statusBadge(b.status)}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn btn-outline btn-sm" data-act="confirm" data-id="${b.id}" ${b.status === "confirmed" ? "disabled" : ""}>${t("admin.act.confirm")}</button>
            <button type="button" class="btn btn-outline btn-sm" data-act="cancel" data-id="${b.id}" ${b.status === "cancelled" ? "disabled" : ""}>${t("admin.act.cancel")}</button>
            <button type="button" class="btn btn-outline btn-sm" data-act="reschedule" data-id="${b.id}" ${b.status === "cancelled" ? "disabled" : ""}>${t("admin.act.resched")}</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  tbody.querySelectorAll("button[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => onRowAction(btn));
  });
}

let rescheduleId = null;

function onRowAction(btn) {
  const id = btn.getAttribute("data-id");
  const act = btn.getAttribute("data-act");
  if (act === "confirm") {
    updateBooking(id, { status: "confirmed" });
  } else if (act === "cancel") {
    updateBooking(id, { status: "cancelled" });
  } else if (act === "reschedule") {
    rescheduleId = id;
    qs("modal-reschedule")?.classList.remove("hidden");
    qs("reschedule-date").value = "";
    qs("reschedule-time").innerHTML = timeSlots
      .map((s) => `<option value="${s.value}">${s.label}</option>`)
      .join("");
  }
}

function wireModal() {
  qs("modal-close")?.addEventListener("click", () => {
    qs("modal-reschedule")?.classList.add("hidden");
    rescheduleId = null;
  });
  qs("modal-save")?.addEventListener("click", async () => {
    const date = qs("reschedule-date").value;
    const time = qs("reschedule-time").value;
    if (!date || !time || !rescheduleId) return;
    await updateBooking(rescheduleId, { date, time, status: "confirmed" });
    qs("modal-reschedule")?.classList.add("hidden");
    rescheduleId = null;
  });
}

const reminderLog = [];

let reminderBusy = false;

async function tickReminders(bookings) {
  if (reminderBusy) return;
  reminderBusy = true;
  try {
    const list = qs("reminder-log-list");
    const log = await processReminders(bookings, (title, body) => {
      reminderLog.push({ t: new Date().toISOString(), title, body });
      if (reminderLog.length > 20) reminderLog.shift();
    });
    if (list && log.length) {
      const items = log
        .map(
          (l) =>
            `<li><code>${l.offsetMin} ${t("admin.log.offsetLabel")}</code> — ${escapeHtml(l.body.slice(0, 100))}…</li>`
        )
        .join("");
      list.insertAdjacentHTML("afterbegin", items);
    }
  } finally {
    reminderBusy = false;
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let lastBookings = [];
let lastDataMode = "mock";

async function main() {
  initI18n({ titleKey: "doc.adminTitle" });

  const { mode } = await initDataLayer();
  lastDataMode = mode;

  function refreshAdminBanner() {
    const el = qs("admin-mode-banner");
    if (!el) return;
    el.textContent =
      lastDataMode === "mock" ? t("admin.banner.mock") : t("admin.banner.live");
  }

  refreshAdminBanner();

  window.addEventListener("salon:lang", () => {
    document.title = t("doc.adminTitle");
    applyTranslations();
    refreshAdminBanner();
    renderStats(lastBookings);
    renderTable(lastBookings);
  });

  wireModal();

  qs("btn-notify-perm")?.addEventListener("click", () => {
    requestNotificationPermission().then((p) => {
      qs("notify-perm-status").textContent =
        p === "granted"
          ? t("admin.notify.ok")
          : p === "denied"
            ? t("admin.notify.denied")
            : t("admin.notify.unsupported");
    });
  });

  subscribeBookings((bookings) => {
    lastBookings = bookings;
    renderStats(bookings);
    renderTable(bookings);
    tickReminders(bookings);
  });
}

main();
