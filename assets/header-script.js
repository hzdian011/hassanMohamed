
  const burgerBtn = document.getElementById("burger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    burgerBtn.textContent = burgerBtn.textContent === "☰" ? "✖" : "☰";
  });

