
"use strict";
const WA_NUMBER = "919850826021";
const waBase = "https://wa.me/" + WA_NUMBER;
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
  }));
}
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
const backTop = document.querySelector(".back-top");
window.addEventListener("scroll", () => { if (backTop) backTop.classList.toggle("visible", window.scrollY > 500); }, {passive:true});
if (backTop) backTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  dateInput.min = localToday;
}
function openWhatsApp(message) { window.open(waBase + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer"); }
const appointmentForm = document.querySelector("#appointment-form");
if (appointmentForm) appointmentForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!appointmentForm.reportValidity()) return;
  const data = new FormData(appointmentForm);
  const mobile = String(data.get("mobile") || "").trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) { appointmentForm.querySelector('[name="mobile"]').setCustomValidity("Enter a valid 10-digit Indian mobile number."); appointmentForm.querySelector('[name="mobile"]').reportValidity(); return; }
  appointmentForm.querySelector('[name="mobile"]').setCustomValidity("");
  const chosenDate = String(data.get("date"));
  const today = new Date(); today.setHours(0,0,0,0);
  const selected = new Date(chosenDate + "T00:00:00");
  if (!chosenDate || selected < today) { dateInput.setCustomValidity("Choose today or a future date."); dateInput.reportValidity(); return; }
  dateInput.setCustomValidity("");
  const msg = ["Hello, I would like to request an appointment. Please verify availability.",
    "Patient name: " + data.get("name"), "Mobile: " + mobile, "Email: " + (data.get("email") || "Not provided"),
    "Department: " + data.get("department"), "Preferred doctor: " + (data.get("doctor") || "No preference"),
    "Preferred date: " + chosenDate, "Preferred time: " + data.get("time"),
    "General enquiry: " + (data.get("message") || "Not provided"),
    "", "I understand this is a request only and is not a confirmed appointment."].join("\n");
  const feedback = appointmentForm.querySelector(".form-feedback");
  feedback.textContent = "Your WhatsApp message is ready. Please review it and press Send in WhatsApp. The hospital must confirm your appointment.";
  openWhatsApp(msg);
});
const contactForm = document.querySelector("#contact-form");
if (contactForm) contactForm.addEventListener("submit", event => {
  event.preventDefault(); if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const mobile = String(data.get("mobile") || "").trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) { contactForm.querySelector('[name="mobile"]').setCustomValidity("Enter a valid 10-digit Indian mobile number."); contactForm.querySelector('[name="mobile"]').reportValidity(); return; }
  const msg = "Hello, I have a general enquiry.\\nName: " + data.get("name") + "\\nMobile: " + mobile + "\\nMessage: " + data.get("message");
  contactForm.querySelector(".form-feedback").textContent = "WhatsApp is opening with your enquiry. Please review and send it.";
  openWhatsApp(msg);
});
const filter = document.querySelector("#doctor-filter");
if (filter) filter.addEventListener("change", () => {
  document.querySelectorAll(".doctor-card").forEach(card => {
    card.hidden = filter.value !== "all" && card.dataset.specialty !== filter.value;
  });
});
const quotes = [
  {q:"“The team was kind and explained each step clearly.”",p:"Sample Patient"},
  {q:"“I felt listened to and treated with respect.”",p:"Sample Visitor"},
  {q:"“The staff helped me understand the next steps.”",p:"Sample Patient"}
];
let quoteIndex = 0;
function renderQuote() { const q=document.querySelector("[data-quote]"),p=document.querySelector("[data-person]"); if(q&&p){q.textContent=quotes[quoteIndex].q;p.textContent=quotes[quoteIndex].p;} }
document.querySelector("[data-prev]")?.addEventListener("click",()=>{quoteIndex=(quoteIndex+quotes.length-1)%quotes.length;renderQuote();});
document.querySelector("[data-next]")?.addEventListener("click",()=>{quoteIndex=(quoteIndex+1)%quotes.length;renderQuote();});
