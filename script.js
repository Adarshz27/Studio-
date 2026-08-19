// ==============================
// Palette Studio site configuration
// ==============================
// Change this value whenever you want enquiries to go to another WhatsApp number.
// Use the full international country code, without +, spaces or dashes.
const WHATSAPP_NUMBER = "918884986006"; // India: +91 8884986006

const loader = document.querySelector(".loader");
window.addEventListener("load", () => setTimeout(() => loader?.classList.add("hide"), 700));

const header = document.querySelector(".site-header");
const nav = document.getElementById("nav");
const toggle = document.getElementById("menuToggle");

// ==============================
// Mobile menu + landing/page navigation
// ==============================
const menuPageSections = [...document.querySelectorAll(".menu-page-section")];
const landingSections = [...document.querySelectorAll(".landing-section")];

const closeMenu = () => {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  document.documentElement.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
  header?.classList.remove("menu-open");
};

const showMenuPage = (id) => {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains("menu-page-section")) return false;

  document.body.classList.add("single-menu-page");
  menuPageSections.forEach(section => section.classList.toggle("active-menu-page", section === target));
  window.scrollTo({ top: 0, behavior: "smooth" });
  return true;
};

const showLandingPage = () => {
  document.body.classList.remove("single-menu-page");
  menuPageSections.forEach(section => section.classList.remove("active-menu-page"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.documentElement.classList.toggle("menu-open", Boolean(isOpen));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  header?.classList.toggle("menu-open", Boolean(isOpen));
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", e => {
  const href = a.getAttribute("href");
  const id = href?.startsWith("#") ? href.slice(1) : "";
  const target = id ? document.getElementById(id) : null;

  closeMenu();

  // Home, About and Reviews remain part of the opening/landing page.
  if (id === "home") {
    e.preventDefault();
    showLandingPage();
    return;
  }

  if (target?.classList.contains("menu-page-section")) {
    e.preventDefault();
    showMenuPage(id);
    return;
  }

  // About / Reviews: stay on the landing page and scroll to the section.
  if (target?.classList.contains("landing-section")) {
    e.preventDefault();
    showLandingPage();
    const headerHeight = header?.offsetHeight || 82;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top, behavior: "smooth" });
  }
}));

// Any button/link pointing to a menu-only section opens that section as its own page view.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (a.closest(".nav")) return; // navigation links are handled above
  a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    const id = href?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    if (target.classList.contains("menu-page-section")) {
      e.preventDefault();
      closeMenu();
      showMenuPage(id);
      return;
    }

    if (target.classList.contains("landing-section")) {
      e.preventDefault();
      closeMenu();
      showLandingPage();
      const headerHeight = header?.offsetHeight || 82;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// Keep the fixed header visually separated from page content after scrolling.
const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 30);
};
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
reveals.forEach(el => observer.observe(el));

const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
if (dot && ring && matchMedia("(pointer:fine)").matches) {
  window.addEventListener("mousemove", e => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    ring.style.left = e.clientX + "px";
    ring.style.top = e.clientY + "px";
  });
  document.querySelectorAll("a,button,.service-card,.gallery-item").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("active"));
  });
}

// Handle direct hash links/bookmark URLs for the menu-only sections.
const initialHash = window.location.hash.slice(1);
if (initialHash && document.getElementById(initialHash)?.classList.contains("menu-page-section")) {
  showMenuPage(initialHash);
} else if (initialHash && document.getElementById(initialHash)?.classList.contains("landing-section")) {
  setTimeout(() => {
    const target = document.getElementById(initialHash);
    const headerHeight = header?.offsetHeight || 82;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top, behavior: "smooth" });
  }, 50);
}

// ==============================
// Contact form -> WhatsApp
// ==============================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const dateInput = document.getElementById("eventDate");

// Do not allow an event date in the past.
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

const getFieldError = id => document.querySelector(`[data-error-for="${id}"]`);

const setFieldError = (field, message = "") => {
  const error = getFieldError(field.id);
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
};

const validateField = field => {
  const value = field.value.trim();

  if (field.required && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "tel" && value && !/^[0-9 +()-]{10,15}$/.test(value)) {
    setFieldError(field, "Enter a valid phone number.");
    return false;
  }

  if (field.type === "email" && value && !field.validity.valid) {
    setFieldError(field, "Enter a valid email address.");
    return false;
  }

  setFieldError(field);
  return true;
};

contactForm?.querySelectorAll("input, select, textarea").forEach(field => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("invalid")) validateField(field);
  });
  field.addEventListener("change", () => validateField(field));
});

contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  if (formStatus) formStatus.textContent = "";

  const fields = [...contactForm.querySelectorAll("input, select, textarea")];
  const valid = fields.map(validateField).every(Boolean);

  if (!valid) {
    const firstInvalid = fields.find(field => field.classList.contains("invalid"));
    firstInvalid?.focus();
    if (formStatus) formStatus.textContent = "Please complete the required fields.";
    return;
  }

  const data = new FormData(contactForm);
  const message = [
    "*New Palette Studio Enquiry*",
    "",
    `*Name:* ${data.get("name")}`,
    `*Phone / WhatsApp:* ${data.get("phone")}`,
    data.get("email") ? `*Email:* ${data.get("email")}` : null,
    `*Service:* ${data.get("service")}`,
    `*Event Date:* ${data.get("date")}`,
    data.get("message") ? `*Message / Requirements:* ${data.get("message")}` : null
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (formStatus) formStatus.textContent = "Opening WhatsApp with your enquiry…";
});
