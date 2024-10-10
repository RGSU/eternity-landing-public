import Events from '../../scripts/Events.js';

export default class InputboxSearchField {
  constructor(element, options) {
    if (!element) throw new Error('undefined element');
    this.element = element;
    this.options = { ...InputboxSearchField.defaults(), ...options };
    this.init();
  }

  static defaults() {
    return {
      baseClass: 'inputbox',
    };
  }

  init() {
    this.events = new Events(this);

    this.input = this.element.querySelector(`.${this.options.baseClass}__input`);
    this.btnClear = this.element.querySelector(`.${this.options.baseClass}__btn-clear`);

    if (this.input && this.btnClear) {
      this.btnClear.addEventListener('click', this.handleBtnClearClick.bind(this));
      this.input.addEventListener('input', this.handleInputChange.bind(this));
      this.input.addEventListener('change', this.handleInputChange.bind(this));
      this.input.addEventListener('focus', this.handleInputChange.bind(this));
    }
  }

  handleInputChange(event) {
    if (this.input) {
      if (event.target.value && !this.input.classList.contains('is-touched')) {
        this.input.classList.add('is-touched');
      } else if (!event.target.value && this.input.classList.contains('is-touched')) {
        this.input.classList.remove('is-touched');
      }
    }
  }

  handleBtnClearClick() {
    if (this.input) {
      this.clearInput();
      this.input.focus();
    }
  }

  clearInput() {
    if (this.input) {
      this.input.value = '';
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.input.classList.remove('is-touched');
    }
  }
}
