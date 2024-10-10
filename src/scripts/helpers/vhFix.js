import debounce from '../utils/debounce.js';

// Fix for 100vh problem with iOS Safari
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
const vh = () => {
  const h = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${h * 0.01}px`);
  document.documentElement.style.setProperty('--doc-height', `${h}px`);
};

window.addEventListener('load', vh);
window.addEventListener('resize', debounce(vh, 500));
