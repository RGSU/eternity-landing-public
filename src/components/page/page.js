import { throttleComplete } from '../../scripts/utils/throttle.js';
import { getScrollTop } from '../../scripts/utils/document.js';
import debounce from '../../scripts/utils/debounce.js';

const handleScrollPage = () => {
  const offset = 10;
  if (getScrollTop() > offset) {
    document.querySelector('.page').classList.add('page--scrolled');
  } else {
    document.querySelector('.page').classList.remove('page--scrolled');
  }
};

window.addEventListener('scroll', throttleComplete(handleScrollPage, 100));

const initPageNav = (el) => {
  const component = el;
  const toggles = document.querySelectorAll('[data-toggle="menu"]');
  const page = document.querySelector('.page');

  const init = () => {
    const isMobile = !matchMedia('(min-width: 80em)').matches;
    if (isMobile && !component.classList.contains('is-initialized')) {
      component.style.visibility = 'hidden';
      component.setAttribute('aria-hidden', 'true');
      component.classList.add('is-initialized');
    }
  };

  // Сброс переключаемого режима
  const reset = () => {
    component.removeAttribute('aria-hidden');
    component.removeAttribute('aria-modal');
    component.removeAttribute('role');
    component.style.visibility = '';
    component.classList.remove('is-initialized');
  };

  init();

  const open = () => {
    component.classList.add('is-open');

    component.removeAttribute('aria-hidden');
    component.setAttribute('aria-modal', 'true');
    component.setAttribute('role', 'dialog');
    component.style.visibility = 'visible';

    toggles.forEach((toggle) => {
      toggle.classList.add('active');
    });

    if (page) page.classList.add('page--nav-open');
  };

  const close = () => {
    component.classList.remove('is-open');

    component.setAttribute('aria-hidden', 'true');
    component.removeAttribute('aria-modal');
    component.removeAttribute('role');
    setTimeout(() => {
      component.style.visibility = 'hidden';
    }, 300);

    toggles.forEach((toggle) => {
      toggle.classList.remove('active');
    });

    if (page) page.classList.remove('page--nav-open');
  };

  const isOpen = () => component.classList.contains('is-open');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isMobile = !matchMedia('(min-width: 80em)').matches;
      if (isMobile) {
        if (isOpen()) {
          close();
        } else {
          open();
        }
      }
    }, true);
  });

  // Закрываем панель по ESC
  document.addEventListener('keydown', (event) => {
    if ((event.code === 'Escape') && isOpen()) {
      close();
    }
  }, false);

  // Закрываем панель по клику за ее пределами
  document.addEventListener('click', (event) => {
    if (isOpen() && (event.target !== component) && !component.contains(event.target)) {
      event.stopPropagation();
      close();
    }
  }, true);

  /* Принудительно закрываем и сбрасываем навигационную панель при
    расширении браузера за пределы мобильных разрешений */
  const handleResizePage = () => {
    const isDesktop = matchMedia('(min-width: 80em)').matches;
    if (isDesktop) {
      if (isOpen()) close();
      setTimeout(reset, 310);
    } else {
      init();
    }
  };

  window.addEventListener('resize', debounce(handleResizePage, 200));
};

document.querySelectorAll('.page__nav-group').forEach((el) => {
  initPageNav(el);
});
