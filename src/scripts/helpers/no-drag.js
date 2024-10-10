document.querySelectorAll('img, a').forEach((el) => {
  el.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });
});
