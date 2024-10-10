/* eslint-disable */

const scrollto = (target, options) => {
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  const opt = {
    duration: options.duration || 900,
    offset: options.offset || 0,
    callback: options.callback,
    easing: options.easing || easeInOutQuad
  };

  let start = (document.body.scrollTop || document.documentElement.scrollTop);
  let offset = typeof opt.offset === 'function' ? opt.offset() : opt.offset;

  let distance = -offset;
  if (typeof target === 'string' && document.querySelector(target)) {
    distance = distance + document.querySelector(target).getBoundingClientRect().top;
  } else if (typeof target === 'object') {
    distance = distance + target.getBoundingClientRect().top;
  } else if (typeof target === 'number') {
    distance = distance + target - start;
  };

  let duration = typeof opt.duration === 'function' ? opt.duration(distance) : opt.duration;
  let timeStart, timeElapsed;

  requestAnimationFrame(function(time) {
    timeStart = time;
    loop(time);
  });

  function loop(time) {
    timeElapsed = time - timeStart;

    window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

    if (timeElapsed < duration){
      requestAnimationFrame(loop)
    } else {
      end();
    }
  }

  function end() {
    window.scrollTo(0, start + distance);

    if (typeof opt.callback === 'function') {
      opt.callback();
    }
  }



};

export default scrollto;
