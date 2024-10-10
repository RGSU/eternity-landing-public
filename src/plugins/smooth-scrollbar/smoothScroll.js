import Lenis from 'lenis';

// document.body.style.zoom = '80%';

const lenis = new Lenis({
  lerp: 0, // Отключаем интерполяцию
  smoothWheel: false, // Отключаем плавную прокрутку колесом
  wheelMultiplier: 0, // Отключаем любое умножение для колеса
  smoothTouch: false, // Отключаем плавную прокрутку на сенсорных экранах
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

export default lenis;

// import Scrollbar from 'smooth-scrollbar';

// Scrollbar.init(document.querySelector('#smooth-scrollbar'), {
//   damping: 0.07,
// });

// let scrollTimeout;

// function smoothScroll(event) {
//   event.preventDefault();

//   if (scrollTimeout) {
//     clearTimeout(scrollTimeout);
//   }

//   const delta = event.deltaY;
//   const duration = 500; // Продолжительность анимации в миллисекундах
//   const start = window.scrollY;
//   const end = start + delta;
//   const startTime = performance.now();

//   function step(currentTime) {
//     const elapsed = currentTime - startTime;
//     const progress = Math.min(elapsed / duration, 1);
//     const ease = (t) => t * (2 - t); // Линейная интерполяция

//     window.scrollTo(0, start + (end - start) * ease(progress));

//     if (progress < 1) {
//       scrollTimeout = requestAnimationFrame(step);
//     }
//   }

//   scrollTimeout = requestAnimationFrame(step);
// }

// window.addEventListener('wheel', smoothScroll, { passive: false });
