"use strict";

document.body.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

function closeMenu(returnFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu(true);
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const copyButton = document.querySelector(".copy-email");
const copyStatus = document.querySelector(".copy-status");
copyButton.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyStatus.textContent = "Email address copied.";
  } catch {
    copyStatus.textContent = "Select the email address above to copy it.";
  }
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
