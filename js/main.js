const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px" },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

const formatNumber = (value, decimals) => {
  const hasDecimal = decimals ?? (!Number.isInteger(value) ? 1 : 0);
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: hasDecimal,
    maximumFractionDigits: hasDecimal,
  });
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const decimals = element.dataset.decimals ? Number(element.dataset.decimals) : undefined;
      const start = performance.now();
      const duration = 1100;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${formatNumber(target * eased, decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = `${formatNumber(target, decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => countObserver.observe(counter));
