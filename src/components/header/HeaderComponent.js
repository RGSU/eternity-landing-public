import Events from '../../scripts/Events.js';
import { throttleComplete } from '../../scripts/utils/throttle.js';
import { getScrollTop } from '../../scripts/utils/document.js';

export default class HeaderComponent {
  constructor(element, options) {
    if (!element) throw new Error('undefined element');
    this.element = element;
    this.options = { ...HeaderComponent.defaults(), ...options };
    this.init();
  }

  static defaults() {
    return {};
  }

  init() {
    this.events = new Events(this);
    this.previousScrollTop = 0;
    this.isFixed = false;
    this.targets = document.querySelectorAll('[data-target="nav"]');
    this.page = document.querySelector('.page');

    this.targets.forEach((target) => {
      target.addEventListener('click', this.handleTargetClick.bind(this));
    });

    this.tabs = this.element.querySelectorAll('.header__actions .header__btn[data-target]');
    const firstTarget = this.tabs && this.tabs[0] ? this.tabs[0].getAttribute('data-target') : '';
    this.activateTab(firstTarget);
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', this.handleTabClick.bind(this));
    });

    document.addEventListener('click', this.handleDocumentClick.bind(this), true);

    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', throttleComplete(this.handleScroll, 200));
  }

  isNavOpen() {
    return this.element.classList.contains('is-nav-open');
  }

  openNav() {
    this.isFixed = true;
    this.element.classList.add('is-nav-open');
    this.page.classList.add('is-nav-open');
    this.targets.forEach((target) => target.classList.add('active'));
  }

  closeNav() {
    this.isFixed = false;
    this.element.classList.remove('is-nav-open');
    this.page.classList.remove('is-nav-open');
    this.targets.forEach((target) => target.classList.remove('active'));
  }

  handleScroll() {
    const currentScrollTop = getScrollTop();
    const isScrollingUp = currentScrollTop < this.previousScrollTop;
    const isHeaderVisible = currentScrollTop < this.element.offsetHeight;
    this.element.classList.toggle('header--hidden', !isScrollingUp && !isHeaderVisible && !this.isFixed);
    this.previousScrollTop = currentScrollTop;
  }

  handleTargetClick(event) {
    event.preventDefault();
    if (this.isNavOpen()) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  activateTab(target) {
    this.tabs.forEach((tab) => {
      const tabTarget = tab.getAttribute('data-target') || '';
      const isActive = tabTarget === target;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-expanded', 'true');
      } else {
        tab.setAttribute('aria-expanded', 'false');
      }
      const targetElement = this.element.querySelector(tabTarget);
      if (targetElement) {
        targetElement.classList.toggle('active', isActive);
      }
    });
  }

  handleTabClick(event) {
    const tab = event.target.closest('.header__btn');
    if (tab) {
      const target = tab.getAttribute('data-target') || '';
      const isDesktop = matchMedia('(min-width: 80em)').matches;
      if (target === '#lang-section' && isDesktop) {
        this.toggleLangMenu();
      } else {
        this.activateTab(target);
      }
    }
  }

  handleDocumentClick(event) {
    const toggleClose = event.target.closest('.js-close-nav');
    if (toggleClose) {
      this.closeNav();
    }

    const isDesktop = matchMedia('(min-width: 80em)').matches;
    if (isDesktop) {
      const langMenuToggle = this.element.querySelector('.header__btn--lang');
      const langMenu = this.element.querySelector('.lang-menu');
      if (langMenu
        && langMenuToggle
        && langMenu.classList.contains('lang-menu--active')
        && !langMenu.contains(event.target)) {
        event.stopPropagation();
        langMenu.classList.remove('lang-menu--active');
        langMenuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  toggleLangMenu() {
    const getElementLeft = (element) => {
      const rect = element.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      return rect.left + scrollLeft;
    };
    const langMenuToggle = this.element.querySelector('.header__btn--lang');
    const langMenu = this.element.querySelector('.lang-menu');
    if (!langMenuToggle || !langMenu) return;
    const isActive = langMenuToggle.classList.contains('lang-menu--active');
    langMenu.classList.toggle('lang-menu--active', !isActive);
    langMenuToggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    if (!isActive) {
      const left = getElementLeft(langMenuToggle);
      langMenu.style.left = `${left}px`;
    }
  }
}
