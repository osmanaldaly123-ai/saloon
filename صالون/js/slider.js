import { initI18n, t, applyTranslations } from "./i18n.js";

/**
 * سلايدر الصور في الصفحة الرئيسية — تلقائي + أسهم + نقاط
 */
export function initHeroSlider(root = document) {
  const track = root.querySelector(".hero-slider__track");
  const slides = root.querySelectorAll(".hero-slider__slide");
  const prev = root.querySelector(".hero-slider__prev");
  const next = root.querySelector(".hero-slider__next");
  const dotsWrap = root.querySelector(".hero-slider__dots");

  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;
  const total = slides.length;

  function go(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${(index * 100) / total}%)`;
    root.querySelectorAll(".hero-slider__dot").forEach((d, di) => {
      d.classList.toggle("hero-slider__dot--active", di === index);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(() => go(index + 1), 5500);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = Array.from({ length: total })
      .map(
        (_, i) =>
          `<button type="button" class="hero-slider__dot${i === 0 ? " hero-slider__dot--active" : ""}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`
      )
      .join("");
    dotsWrap.querySelectorAll(".hero-slider__dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        go(Number(dot.getAttribute("data-slide")));
        start();
      });
    });
  }

  prev?.addEventListener("click", () => {
    go(index - 1);
    start();
  });
  next?.addEventListener("click", () => {
    go(index + 1);
    start();
  });

  const section = root.querySelector(".hero-slider-section");
  section?.addEventListener("mouseenter", stop);
  section?.addEventListener("mouseleave", start);

  go(0);
  start();
}

initI18n({ titleKey: "doc.indexTitle" });
window.addEventListener("salon:lang", () => {
  applyTranslations();
  document.title = t("doc.indexTitle");
});
initHeroSlider();
