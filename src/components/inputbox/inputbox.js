import InputboxSearchField from './InputboxSearchField.js';

document.querySelectorAll('.inputbox').forEach((el) => {
  if (el.querySelector('.inputbox__btn-clear')) {
    el.inputboxSearchField = new InputboxSearchField(el);
  }
});
