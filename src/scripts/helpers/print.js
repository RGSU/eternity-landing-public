document.querySelectorAll('.js-print').forEach((el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    window.print();
  });
});
