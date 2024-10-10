import lenis from '../../plugins/smooth-scrollbar/smoothScroll.js';

const sections = document.querySelectorAll('.scrolled-section');
const fixedNav = document.querySelector('.fixed-nav');
let navLinks;
let slider;
if (fixedNav) {
  navLinks = fixedNav.querySelectorAll('.fixed-nav__link');
  slider = fixedNav.querySelector('.fixed-nav__slider');

  let scrollTimeout;
  let scrollNavTimeout;

  // eslint-disable-next-line no-inner-declarations
  function moveSliderTo(link) {
    if (slider && link) {
      slider.style.width = `${link.offsetWidth}px`;
      slider.style.left = `${link.offsetLeft}px`;
    }
  }

  // eslint-disable-next-line no-inner-declarations
  function changeActiveLink() {
    if (sections.length > 0 && navLinks.length > 0) {
      let activeIndex = -1;
      const scrollPosition = window.scrollY + window.innerHeight / 2.5;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeIndex = index;
        }
      });

      navLinks.forEach((link) => link.classList.remove('active'));

      if (activeIndex === -1) {
        if (scrollPosition < sections[0].offsetTop) {
          slider.style.width = '120px';
          slider.style.left = '-150px';
          window.clearTimeout(scrollNavTimeout);
          scrollNavTimeout = setTimeout(() => {
            fixedNav.classList.remove('fixed-nav--hidden');
          }, 1);
          fixedNav.style.display = 'flex';
        } else if (scrollPosition > sections[sections.length - 1].offsetTop) {
          fixedNav.classList.add('fixed-nav--hidden');
          window.clearTimeout(scrollNavTimeout);
          scrollNavTimeout = setTimeout(() => {
            fixedNav.style.display = 'none';
          }, 300);
        }
      } else if (sections.length - 1 >= activeIndex) {
        navLinks[activeIndex].classList.add('active');
        window.clearTimeout(scrollNavTimeout);
        scrollNavTimeout = setTimeout(() => {
          fixedNav.classList.remove('fixed-nav--hidden');
        }, 1);
        fixedNav.style.display = 'flex';
        window.clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          moveSliderTo(navLinks[activeIndex]);
        }, 1);
      }
    }
  }

  // eslint-disable-next-line no-inner-declarations
  function onScroll() {
    changeActiveLink();
  }

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', onScroll);
    let lastScrollTop = document.documentElement.scrollTop;
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetHref = link.getAttribute('href');
        if (targetHref) {
          let customOffset = -100;
          const header = document.querySelector('.header');
          const scrollTop = window.scrollY;
          if (scrollTop < lastScrollTop || header.classList.contains('is-nav-open')) {
            customOffset = -100;
          } else {
            customOffset = 0;
          }
          lastScrollTop = scrollTop;
          lenis.scrollTo(targetHref, {
            duration: 3,
            offset: customOffset,
          });
        }
      });
    });
  }
}
