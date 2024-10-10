let resizeTimeout;

function handleResize() {
  const contents = document.querySelectorAll('.manual__card-content');
  contents.forEach((item) => {
    if (item.scrollHeight > 315) {
      item.setAttribute('data-lenis-prevent', true);
    } else {
      item.removeAttribute('data-lenis-prevent');
    }
  });
}

function onResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 300);
}

window.addEventListener('resize', onResize);

handleResize();
