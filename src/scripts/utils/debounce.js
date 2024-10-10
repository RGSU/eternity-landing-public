const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

export default debounce;

// Пример:
// debounceBtn.addEventListener('click', debounce(function() {
//   console.info('Hey! It is', new Date().toUTCString());
// }, 3000));
// или
// window.addEventListener("scroll", debounce(handleScroll, 300));
