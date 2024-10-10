document.addEventListener('click', (event) => {
  function processTypeQuantityButton(plus) {
    const button = event.target;
    const parent = button.closest('.number');
    const input = parent.querySelector('input');
    const step = +input.getAttribute('step') || 1;
    const value = +input.value;

    if (plus) {
      input.value = value + step;
    } else {
      input.value = value - step;
    }
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (event.target.closest('.number .number__minus')) {
    processTypeQuantityButton(false);
  }

  if (event.target.closest('.number .number__plus')) {
    processTypeQuantityButton(true);
  }
});

document.addEventListener('change', (event) => {
  if (!event.target.matches('.number input')) return;

  const input = event.target;
  const { value } = input;

  if (input.hasAttribute('min')) {
    const min = +input.getAttribute('min');
    if (value < min) {
      input.value = min;
    }
  }

  if (input.hasAttribute('max')) {
    const max = +input.getAttribute('max');
    if (value > max) {
      input.value = max;
    }
  }
});

document.addEventListener('keypress', (event) => {
  const input = event.target;
  if (input.closest('.number input')) {
    const key = event.keyCode;
    // Only allow numbers to be entered
    if (key < 48 || key > 57) {
      event.preventDefault();
    }
  }
});
