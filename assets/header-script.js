const burgerBtn = document.getElementById("burger-btn");
const mobileMenu = document.getElementById("mobile-menu");

burgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");

  if (mobileMenu.classList.contains("open")) {
    // أيقونة X
    burgerBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 13.9994L13.7279 1.2715" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1 1L13.7279 13.7279" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  } else {
    // أيقونة Burger
    burgerBtn.innerHTML = `
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1 1H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1 11H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }
});
