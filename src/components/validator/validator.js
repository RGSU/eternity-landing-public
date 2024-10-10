import './validator.plugin.js';
import scrollto from '../../scripts/utils/scrollto.js';

const addFormValidation = (formEl) => {
  const form = formEl;
  if (!form) return;

  // eslint-disable-next-line no-undef
  const validator = new Validator(form);

  form.validator = validator;

  function scrollToFirstError(el) {
    const firstInvalidField = el.querySelector('.is-invalid');
    const isMobile = !matchMedia('(min-width: 80em)').matches;
    if (firstInvalidField && isMobile) {
      scrollto(firstInvalidField, { duration: 700, offset: 80 });
    }
  }

  form.addEventListener('submit', (event) => {
    validator.reinit();
    const valid = validator.validate();
    if (valid) {
      form.classList.remove('invalid');
      form.classList.add('valid');
    } else {
      event.preventDefault();
      form.classList.remove('valid');
      form.classList.add('invalid');
      scrollToFirstError(form);
    }
  });

  // form.querySelectorAll("input, textarea, select").forEach(function(control) {
  //   control.addEventListener("focus", function(event){
  //     validator.reset();
  //   }, false);
  // });

  // form.querySelectorAll("select").forEach(function(control) {
  //   control.addEventListener("change", function(event){
  //     validator.reset();
  //   }, false);
  // });
};

document.querySelectorAll('form[data-validate]').forEach((form) => {
  addFormValidation(form);
});
