/* throttle calls a function at intervals of a specified amount of time
  while the user is carrying out an event */

export const throttle = (func, delay) => {
  let timeout;
  return (...args) => {
    const context = this;
    if (!timeout) {
      func.apply(context, args);
      timeout = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => timeout = false, delay);
    }
  };
};

// Пример:
// throttleBtn.addEventListener('click', throttle(function() {
//   return console.log('Hey! It is', new Date().toUTCString());
// }, 1000));
// или
// window.addEventListener("scroll", throttle(handleScrollPage, 100));

// Вариант throttle, который не упускает последнее срабатывание события
export const throttleComplete = (func, delay) => {
  let lastFunc;
  let lastRan;
  return (...args) => {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= delay) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, delay - (Date.now() - lastRan));
    }
  };
};
