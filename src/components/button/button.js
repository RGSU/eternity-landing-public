document.querySelectorAll('.js-btn-ripple').forEach((button) => {
  const ripple = button.querySelector('.button__fill-ripple');
  button.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ripple.style.transformOrigin = `${x}% ${y}%`;

    ripple.dataset.originX = x;
    ripple.dataset.originY = y;
  });

  button.addEventListener('mouseleave', () => {
    const x = ripple.dataset.originX;
    const y = ripple.dataset.originY;
    ripple.style.transformOrigin = `${x}% ${y}%`;
  });
});

document.querySelectorAll('.js-btn-gradient').forEach((button) => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
    button.style.setProperty('--before-height', `${button.offsetWidth}px`);
  });
});
