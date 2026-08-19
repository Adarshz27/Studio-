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

// Mobile menu: lock the page while the menu is open so the menu cannot overlap/scroll with content.
toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.documentElement.classList.toggle("menu-open", Boolean(isOpen));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  header?.classList.toggle("menu-open", Boolean(isOpen));
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  document.documentElement.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
  header?.classList.remove("menu-open");
}));

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

// Smooth in-page navigation with room for the fixed header.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      const headerHeight = header?.offsetHeight || 82;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

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
