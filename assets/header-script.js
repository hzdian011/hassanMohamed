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


const btn = document.querySelector('.gift-btn');
const arrow = btn.querySelector('.arrow-icon');
const bgDuration = 600; // زمن حركة الخلفية (لازم يساوي transition بتاع ::before)

btn.addEventListener('mouseenter', () => {
  // 1- اختفاء السهم لحظياً
  arrow.classList.add('hidden');
  arrow.classList.remove('black-arrow');

  // 2- تفعيل الخلفية
  btn.classList.add('hovering');

  // 3- بعد انتهاء الخلفية يظهر أبيض
  setTimeout(() => {
    arrow.classList.remove('hidden');
    arrow.classList.add('white-arrow');
  }, bgDuration);
});

btn.addEventListener('mouseleave', () => {
  // 4- اختفاء السهم لحظياً
  arrow.classList.add('hidden');
  arrow.classList.remove('white-arrow');

  // 5- الخلفية ترجع
  btn.classList.remove('hovering');

  // 6- بعد انتهاء الخلفية يظهر أسود
  setTimeout(() => {
    arrow.classList.remove('hidden');
    arrow.classList.add('black-arrow');
  }, bgDuration);
});
