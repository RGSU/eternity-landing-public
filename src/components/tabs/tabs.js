class Tabs {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...Tabs.defaults(), ...options };
    this.init();
  }

  static defaults() {
    return {
      baseClass: 'tabs',
    };
  }

  init() {
    this.tabs = this.element.querySelectorAll(`.${this.options.baseClass}__tab`);
    this.initActiveTab();
    this.processTabsClicks();
  }

  processTabsClicks() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        if (!tab.hasAttribute('href') && !tab.classList.contains('active')) {
          this.activateTab(tab.getAttribute('data-target'));
        }
        this.moveSliderTo(tab);
      });
    });
  }

  initActiveTab() {
    const activeTab = this.element.querySelector(`.${this.options.baseClass}__tab.active`) || this.tabs[0];
    if (activeTab) {
      if (activeTab.hasAttribute('href') && activeTab.classList.contains('active')) {
        this.scrollToLeft(activeTab);
      } else {
        this.activateTab(activeTab.getAttribute('data-target'));
      }
      this.moveSliderTo(activeTab);
    }
  }

  activateTab(selector) {
    this.tabs.forEach((tab) => {
      const targetSelector = tab.getAttribute('data-target');
      const isTarget = targetSelector === selector;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-expanded', isTarget);
      const target = document.querySelector(targetSelector);
      if (target) target.classList.toggle('active', `#${target.id}` === selector);
      if (isTarget) this.scrollToLeft(tab);
    });
  }

  moveSliderTo(link) {
    const slider = this.element.querySelector(`.${this.options.baseClass}__items-slider`);
    if (slider && link) {
      slider.style.width = `${link.offsetWidth}px`;
      slider.style.left = `${link.offsetLeft}px`;
    }
  }

  scrollToLeft(activeButton) {
    const item = activeButton.closest(`.${this.options.baseClass}__item`);
    const tabs = this.element.querySelector(`.${this.options.baseClass}__tabs`);
    tabs.scrollTo({
      left: item.offsetLeft,
      behavior: 'smooth',
    });
  }
}

document.querySelectorAll('.tabs').forEach((el) => {
  const tabs = new Tabs(el);
  el.tabs = tabs;
});
