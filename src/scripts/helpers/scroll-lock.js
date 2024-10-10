import { isIOS } from '../utils/device.js';

export default class ScrollLock {
  constructor() {
    this.iosChecker = isIOS;
    this.lockClass = this.iosChecker() ? 'scroll-lock-ios' : 'scroll-lock';
    this.scrollTop = null;
    this.fixedBlockElements = document.querySelectorAll('[data-fix-block]');
  }

  static getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

  static getBodyScrollTop = () => (
    window.scrollY
    || (document.documentElement && document.documentElement.ScrollTop)
    || (document.body && document.body.scrollTop)
  );

  disableScrolling = () => {
    document.documentElement.style.scrollBehavior = 'auto';
    // eslint-disable-next-line max-len
    document.body.dataset.scroll = document.body.dataset.scroll ? document.body.dataset.scroll : this.getBodyScrollTop();
    this.scrollTop = document.body.dataset.scroll;
    if (this.getScrollbarWidth()) {
      document.body.style.paddingRight = `${this.getScrollbarWidth()}px`;
      this.fixedBlockElements.forEach((block) => {
        block.style.paddingRight = `${this.getScrollbarWidth()}px`;
      });
    }
    document.body.style.top = `-${this.scrollTop}px`;
    document.body.classList.add(this.lockClass);
  };

  enableScrolling() {
    document.body.classList.remove(this.lockClass);
    document.body.style.paddingRight = null;
    document.body.style.top = null;
    this.fixedBlockElements.forEach((block) => {
      block.style.paddingRight = null;
    });
    this.scrollTop = null;
    const scrollTop = +document.body.dataset.scroll;
    if (scrollTop) {
      window.scrollTo(0, scrollTop);
    }
    document.body.removeAttribute('data-scroll');
    document.documentElement.style.scrollBehavior = '';
  }
}

window.scrollLock = new ScrollLock();
