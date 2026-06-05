(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("deck-theme");
  if (saved) root.dataset.theme = saved;

  function updateButton() {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.textContent = root.dataset.theme === "light" ? "☾" : "☼";
  }

  window.addEventListener("DOMContentLoaded", () => {
    updateButton();
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      localStorage.setItem("deck-theme", root.dataset.theme);
      updateButton();
    });
  });
})();
