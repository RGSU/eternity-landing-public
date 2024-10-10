import Events from '../../scripts/Events.js';

export default class VideoPopup {
  constructor(options) {
    this.options = { ...VideoPopup.defaults(), ...options };
    this.init();
  }

  static defaults() {
    return {
      baseClass: 'video-popup',
      showBtnClose: true,
      closeOnBackdropClick: true,
      disableScroll: true,
      fixHeaderPadding: false,
    };
  }

  init() {
    this.scrollTop = 0;
    this.scrollDisableCounter = 0;
    this.events = new Events(this);
    this.dialogId = `video-popup-${Math.random().toString(36).slice(-9)}`;
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  static getVideoId(url) {
    if (url.includes('rutube.ru')) {
      const regex = /(?:https?:\/\/)?rutube\.ru\/video\/([a-zA-Z0-9]+)/;
      const match = url.match(regex);
      return match ? match[1] : '';
    }
    return '';
  }

  static getVideoProvider(url) {
    let provider = '';
    if (url.includes('rutube.ru')) {
      provider = 'rutube';
    } else if (url.includes('youtube')) {
      provider = 'youtube';
    }
    return provider;
  }

  handleDocumentClick(event) {
    if (this.options.closeOnBackdropClick) {
      const target = event.target.closest('[data-video-popup]');
      if (target) {
        event.preventDefault();
        this.targetElement = target;
        this.open();
      } else if (event.target.closest('[data-video-popup-close]')) {
        this.close();
        event.preventDefault();
      }
    }
  }

  open(params = {}) {
    this.emit('beforeOpen');
    if (!this.dialog) this.dialog = this.createDialog(params);
    if (this.dialog) {
      this.dialog.classList.add('is-opening');
      this.disableScrolling();
      this.boundHandleAnimationEnd = this.handleAnimationEnd.bind(this);
      this.dialog.addEventListener('animationend', this.boundHandleAnimationEnd);
      this.dialog.showModal();
    }
  }

  deleteDialog() {
    if (this.dialog) {
      this.dialog.remove();
      this.dialog = null;
    }
  }

  close() {
    this.emit('beforeClose');
    if (this.dialog) {
      this.dialog.classList.add('is-closing');
      this.boundHandleAnimationEnd = this.handleAnimationEnd.bind(this);
      this.dialog.addEventListener('animationend', this.boundHandleAnimationEnd);
    }
  }

  handleAnimationEnd() {
    if (this.dialog) {
      if (this.dialog.classList.contains('is-closing')) {
        this.dialog.classList.remove('is-closing');
        this.dialog.close();
        this.enableScrolling();
        this.deleteDialog();
        this.emit('close');
      } else {
        this.dialog.classList.remove('is-opening');
        this.emit('open');
      }
      if (this.dialog) {
        this.dialog.removeEventListener('animationend', this.boundHandleAnimationEnd);
      }
    }
  }

  createDialog(params = {}) {
    const { url, poster } = params;
    const videoUrl = url
    || this.targetElement.getAttribute('data-video-popup')
    || this.targetElement.getAttribute('href')
    || '';
    const videoId = VideoPopup.getVideoId(videoUrl);
    const videoProvider = VideoPopup.getVideoProvider(videoUrl);

    const dialog = document.createElement('dialog');
    dialog.classList.add('video-popup');
    dialog.id = this.dialogId;
    dialog.setAttribute('data-provider', videoProvider);

    const btnClose = document.createElement('button');
    btnClose.classList.add(`${this.options.baseClass}__btn-close`);
    btnClose.setAttribute('type', 'button');
    btnClose.setAttribute('title', 'Закрыть');
    btnClose.setAttribute('data-video-popup-close', '');
    dialog.append(btnClose);

    const main = document.createElement('div');
    main.classList.add(`${this.options.baseClass}__main`);
    dialog.append(main);

    dialog.addEventListener('click', this.handleModalClick.bind(this));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });

    if (videoId && videoProvider === 'rutube') {
      const rutubeHtml = `<div class="${this.options.baseClass}__iframe-wrapper"><iframe src="https://rutube.ru/play/embed/${videoId}" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>`;
      main.innerHTML = rutubeHtml;
    } else if (videoId && videoProvider === 'youtube') {
      // TODO: add iframe for youtube
    } else {
      const videoPoster = poster
        || this.targetElement ? this.targetElement.getAttribute('data-video-popup-poster') : '';
      const posterHtml = videoPoster ? ` poster="${videoPoster}"` : '';
      const videoHtml = `
        <div class="${this.options.baseClass}__video-wrapper">
        <video preload="auto" controls playsinline ${posterHtml}>
        <source src="${videoUrl}" type="video/mp4">
        </video>
        </div>`;
      main.innerHTML = videoHtml;
    }

    document.body.append(dialog);
    return dialog;
  }

  handleModalClick(event) {
    if (this.dialog) {
      const dialogRect = this.dialog.getBoundingClientRect();
      if (event.clientX < dialogRect.left
        || event.clientX > dialogRect.right
        || event.clientY < dialogRect.top
        || event.clientY > dialogRect.bottom) {
        this.close();
      }
    }
  }

  disableScrolling() {
    if (!this.options.disableScroll) return;

    const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

    const getBodyScrollTop = () => window.scrollY
      || (document.documentElement && document.documentElement.scrollTop)
      || (document.body && document.body.scrollTop);

    this.scrollDisableCounter += 1;

    document.documentElement.style.scrollBehavior = 'auto';
    this.scrollTop = document.body.dataset.scroll
      ? document.body.dataset.scroll
      : getBodyScrollTop();
    document.body.dataset.scroll = this.scrollTop;
    if (getScrollbarWidth()) {
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      if (this.options.fixHeaderPadding) {
        const header = document.querySelector('.header__wrapper');
        if (header) header.style.paddingRight = `${getScrollbarWidth()}px`;
      }
    }
    document.body.style.top = `-${this.scrollTop}px`;
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.classList.add('is-scroll-locked');
  }

  enableScrolling() {
    if (!this.options.disableScroll) return;

    this.scrollDisableCounter -= 1;

    if (this.scrollDisableCounter > 0) return;

    document.body.style.position = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.paddingRight = '';
    document.body.style.top = '';
    if (this.options.fixHeaderPadding) {
      const header = document.querySelector('.header__wrapper');
      if (header) header.style.paddingRight = '';
    }
    document.body.classList.remove('is-scroll-locked');
    this.scrollTop = null;
    const savedScrollTop = +document.body.dataset.scroll;
    if (savedScrollTop) {
      window.scrollTo(0, savedScrollTop);
    }
    document.body.removeAttribute('data-scroll');
    document.documentElement.style.scrollBehavior = '';
  }
}
