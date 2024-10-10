document.addEventListener('click', (event) => {
  const toggle = event.target;
  if (toggle.closest('.field__password-toggle')) {
    const field = toggle.closest('.field');
    if (field) {
      const input = field.querySelector('input');
      if (input) {
        if (input.getAttribute('type') === 'password') {
          input.setAttribute('type', 'text');
        } else {
          input.setAttribute('type', 'password');
        }
      }
    }
  }
});

const checkLastChar = (node, char = '*') => node.textContent.trim().endsWith(char);

const addRequiredSign = (el) => {
  const label = el.closest('.field').querySelector('.field__label');
  if (label && (checkLastChar(label, '*'))) return;
  const controlEl = el.closest('.field__control');
  if (controlEl) {
    controlEl.classList.add('field__control--required');
  }
};

document.querySelectorAll('input[required], textarea[required], select[required]').forEach((el) => {
  addRequiredSign(el);
});
