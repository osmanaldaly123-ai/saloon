import {
  SERVICES,
  STAFF,
  generateTimeSlots,
  getServiceById,
  getStaffById,
  formatDateISO,
} from "./app.js";
import { initDataLayer, addBooking, getBookedSlots } from "./data.js";
import { initI18n, t, getLang, applyTranslations } from "./i18n.js";

const STEP_KEYS = [
  "booking.step1",
  "booking.step2",
  "booking.step3",
  "booking.step4",
  "booking.step5",
];

let step = 0;
let selectedServiceId = null;
let selectedStaffId = null;
let selectedDate = null;
let selectedTime = null;
const timeSlots = generateTimeSlots();
let lastDataMode = "mock";

function qs(id) {
  return document.getElementById(id);
}

function setStep(n) {
  step = Math.max(0, Math.min(n, STEP_KEYS.length - 1));
  renderSteps();
  updatePanels();
}

function renderSteps() {
  const el = qs("steps-indicator");
  if (!el) return;
  el.innerHTML = STEP_KEYS.map(
    (key, i) =>
      `<span class="step-pill${i === step ? " active" : ""}">${i + 1}. ${t(key)}</span>`
  ).join("");
}

function updatePanels() {
  for (let i = 0; i < STEP_KEYS.length; i++) {
    const panel = qs(`step-panel-${i}`);
    if (panel) panel.classList.toggle("hidden", i !== step);
  }
  const nav = qs("form-nav");
  if (nav) {
    const prev = nav.querySelector('[data-action="prev"]');
    const next = nav.querySelector('[data-action="next"]');
    if (prev) {
      prev.classList.toggle("hidden", step === 0);
      prev.textContent = t("booking.prev");
    }
    if (next) {
      next.textContent =
        step === STEP_KEYS.length - 1 ? t("booking.confirm") : t("booking.next");
    }
  }
}

function readReminderSelection() {
  const checks = [...document.querySelectorAll('input[name="reminder"]:checked')];
  const minutes = checks.map((c) => Number(c.value));
  const customInput = qs("reminder-custom-minutes");
  const custom = customInput && customInput.value ? Number(customInput.value) : null;
  return { minutes, custom: custom && custom > 0 ? custom : null };
}

function validateStep() {
  if (step === 0) {
    const name = qs("customer-name")?.value?.trim();
    const phone = qs("customer-phone")?.value?.trim();
    if (!name || !phone) {
      showError(t("booking.err.name"));
      return false;
    }
  }
  if (step === 1 && !selectedServiceId) {
    showError(t("booking.err.service"));
    return false;
  }
  if (step === 2 && !selectedStaffId) {
    showError(t("booking.err.staff"));
    return false;
  }
  if (step === 3) {
    if (!selectedDate) {
      showError(t("booking.err.date"));
      return false;
    }
    if (!selectedTime) {
      showError(t("booking.err.time"));
      return false;
    }
  }
  if (step === 4) {
    const { minutes, custom } = readReminderSelection();
    if (minutes.length === 0 && !custom) {
      showError(t("booking.err.reminder"));
      return false;
    }
  }
  hideError();
  return true;
}

function showError(msg) {
  const b = qs("form-error");
  if (b) {
    b.textContent = msg;
    b.classList.remove("hidden");
  }
}

function hideError() {
  const b = qs("form-error");
  if (b) b.classList.add("hidden");
}

function renderServices() {
  const container = qs("service-picker");
  if (!container) return;
  container.innerHTML = SERVICES.map((s) => {
    const durKey = `svc.dur.${s.id}`;
    const nameKey = `svc.${s.id}`;
    const dur = t(durKey);
    const displayDur = dur === durKey ? s.duration : dur;
    const nm = t(nameKey);
    const displayName = nm === nameKey ? s.name : nm;
    return `
    <button type="button" class="service-option${selectedServiceId === s.id ? " selected" : ""}" data-service="${s.id}">
      <img src="${s.image}" alt="" width="56" height="56" loading="lazy" />
      <div class="info">
        <strong>${s.emoji} ${displayName}</strong>
        <span>${t("booking.duration")}: ${displayDur}</span>
      </div>
      <span class="btn btn-outline btn-sm">${t("booking.choose")}</span>
    </button>`;
  }).join("");

  container.querySelectorAll(".service-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedServiceId = btn.getAttribute("data-service");
      renderServices();
    });
  });
}

function renderStaff() {
  const container = qs("staff-grid");
  if (!container) return;
  container.innerHTML = STAFF.map((st) => {
    const titleKey = `staff.${st.id}.title`;
    const title = t(titleKey);
    const displayTitle = title === titleKey ? st.title : title;
    return `
    <div class="staff-card${selectedStaffId === st.id ? " selected" : ""}" data-staff="${st.id}" role="button" tabindex="0">
      <img src="${st.image}" alt="" width="88" height="88" loading="lazy" />
      <h3>${st.name}</h3>
      <div class="role">${displayTitle}</div>
      <div class="rating">${st.rating}</div>
      <button type="button" class="btn btn-outline btn-sm">${t("booking.choose")}</button>
    </div>`;
  }).join("");

  container.querySelectorAll(".staff-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedStaffId = card.getAttribute("data-staff");
      renderStaff();
      refreshSlots();
    });
  });
}

let calendarView = new Date();

function renderCalendar() {
  const grid = qs("calendar-days");
  const title = qs("calendar-month-title");
  if (!grid || !title) return;

  const y = calendarView.getFullYear();
  const m = calendarView.getMonth();
  title.textContent = new Intl.DateTimeFormat(getLang() === "en" ? "en" : "ar", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m, 1));

  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const offset = firstDow;
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(`<div class="calendar-day muted"></div>`);

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(y, m, d);
    const iso = formatDateISO(cellDate);
    const past = cellDate < today;
    const isSel = selectedDate === iso;
    cells.push(
      `<button type="button" class="calendar-day${past ? " muted" : ""}${isSel ? " selected" : ""}" data-date="${iso}" ${past ? "disabled" : ""}>${d}</button>`
    );
  }
  grid.innerHTML = cells.join("");

  grid.querySelectorAll(".calendar-day[data-date]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      selectedDate = btn.getAttribute("data-date");
      selectedTime = null;
      renderCalendar();
      await refreshSlots();
    });
  });
}

async function refreshSlots() {
  const wrap = qs("slots-grid");
  if (!wrap) return;
  if (!selectedDate || !selectedStaffId) {
    wrap.innerHTML = `<p class="meta">${t("booking.slotsEmpty")}</p>`;
    return;
  }
  const booked = await getBookedSlots(selectedDate, selectedStaffId);
  wrap.innerHTML = timeSlots
    .map((slot) => {
      const disabled = booked.includes(slot.value);
      const sel = selectedTime === slot.value;
      return `<button type="button" class="slot-btn${sel ? " selected" : ""}" data-slot="${slot.value}" ${disabled ? "disabled" : ""}>${slot.label}</button>`;
    })
    .join("");

  wrap.querySelectorAll(".slot-btn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTime = btn.getAttribute("data-slot");
      refreshSlots();
    });
  });
}

function wireReminderLabels() {
  document.querySelectorAll(".reminder-option").forEach((label) => {
    const input = label.querySelector("input");
    if (!input) return;
    const sync = () => {
      document.querySelectorAll(".reminder-option").forEach((l) => {
        const cb = l.querySelector("input");
        l.classList.toggle("selected", cb && cb.checked);
      });
    };
    input.addEventListener("change", sync);
    label.addEventListener("click", (e) => {
      if (e.target !== input) {
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change"));
      }
    });
    sync();
  });
}

async function submitBooking() {
  const name = qs("customer-name").value.trim();
  const phone = qs("customer-phone").value.trim();
  const { minutes, custom } = readReminderSelection();
  const offsets = [...new Set([...minutes, ...(custom ? [custom] : [])])].sort(
    (a, b) => b - a
  );

  hideError();
  const submitBtn = qs("form-nav")?.querySelector('[data-action="next"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const booking = await addBooking({
      customerName: name,
      customerPhone: phone,
      serviceId: selectedServiceId,
      staffId: selectedStaffId,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
      reminderOffsetsMinutes: offsets,
      reminderCustomMinutes: custom,
    });

    showConfirmation(booking);
  } catch (e) {
    console.error(e);
    showError(t("booking.saveErr"));
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function showConfirmation(booking) {
  const form = qs("booking-form");
  const conf = qs("confirmation-screen");
  const stepsEl = qs("steps-indicator");
  const nav = qs("form-nav");
  if (form) form.classList.add("hidden");
  if (stepsEl) stepsEl.classList.add("hidden");
  if (nav) nav.classList.add("hidden");
  if (conf) conf.classList.remove("hidden");

  const svc = getServiceById(booking.serviceId);
  const st = getStaffById(booking.staffId);
  const slotLabel = timeSlots.find((t) => t.value === booking.time)?.label || booking.time;

  qs("conf-name").textContent = booking.customerName;
  qs("conf-service").textContent = svc ? `${svc.emoji} ${svc.name}` : booking.serviceId;
  qs("conf-staff").textContent = st ? st.name : booking.staffId;
  qs("conf-date").textContent = booking.date;
  qs("conf-time").textContent = slotLabel;
  applyTranslations();
}

function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get("service");
  if (sid && SERVICES.some((s) => s.id === sid)) {
    selectedServiceId = sid;
    setStep(1);
  }
}

async function main() {
  initI18n({ titleKey: "doc.bookingTitle" });

  const { mode } = await initDataLayer();
  lastDataMode = mode;
  const banner = qs("data-mode-banner");
  if (banner) {
    banner.textContent =
      mode === "mock" ? t("booking.banner.mock") : t("booking.banner.live");
  }

  function refreshModeBanner() {
    const b = qs("data-mode-banner");
    if (!b) return;
    b.textContent =
      lastDataMode === "mock" ? t("booking.banner.mock") : t("booking.banner.live");
  }

  window.addEventListener("salon:lang", () => {
    document.title = t("doc.bookingTitle");
    applyTranslations();
    refreshModeBanner();
    renderSteps();
    renderServices();
    renderStaff();
    renderCalendar();
    refreshSlots();
    updatePanels();
  });

  prefillFromQuery();
  renderSteps();
  renderServices();
  renderStaff();
  renderCalendar();
  wireReminderLabels();

  qs("cal-prev")?.addEventListener("click", () => {
    calendarView.setMonth(calendarView.getMonth() - 1);
    renderCalendar();
  });
  qs("cal-next")?.addEventListener("click", () => {
    calendarView.setMonth(calendarView.getMonth() + 1);
    renderCalendar();
  });

  qs("form-nav")?.addEventListener("click", async (e) => {
    const btnEl = e.target.closest("button");
    if (!btnEl) return;
    const action = btnEl.getAttribute("data-action");
    if (action === "prev") {
      setStep(step - 1);
      return;
    }
    if (action === "next") {
      if (!validateStep()) return;
      if (step < STEP_KEYS.length - 1) {
        setStep(step + 1);
        if (step === 3) {
          if (!selectedDate) {
            selectedDate = formatDateISO(new Date());
            renderCalendar();
          }
          await refreshSlots();
        }
        return;
      }
      await submitBooking();
    }
  });

  updatePanels();
  await refreshSlots();
}

main();
