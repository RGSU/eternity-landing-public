const isIOS = () => ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document));

const isTouchDevice = () => ((
  'ontouchstart' in window)
  || (navigator.maxTouchPoints > 0)
  || (navigator.msMaxTouchPoints > 0));

export { isIOS, isTouchDevice };
