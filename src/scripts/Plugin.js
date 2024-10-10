/* eslint-disable */

import Events from './Events.js';

export default class Plugin {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.events = new Events(this);

    if (!this.isInited()) {
      this._init();
    }
  }

  _init() {
    this.mergeOptions();
    this.buildCache();
    this.bindEvents();
    this.setInited();
    this.init();
  }

  mergeOptions() {
    this.options = Object.assign({}, this.defaults(), this.options);
    this.options = deepMerge(this.defaults(), this.options);
  }

  defaults() {
    return {};
  }

  init() {}

  buildCache() {}

  bindEvents() {}

  setInitialized() {
    this.element.classList.add("is-initialized")
  }

  isInitialized() {
    return this.element.classList.contains("is-initialized");
  }

  callback(name, ...parameters) {
    const callback = this.options[name];

    if (typeof callback === "function") {
      return callback.call(...parameters);
    }
  }
}
