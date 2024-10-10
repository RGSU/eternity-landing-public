import scrollto from '../../scripts/utils/scrollto.js';
import debounce from '../../scripts/utils/debounce.js';

document.querySelectorAll('.scroll-top').forEach((scrollTop) => {
  scrollTop.addEventListener('click', (event) => {
    event.preventDefault();
    scrollto(0, { duration: 700 });
  }, false);

  const handleScroll = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const top = window.pageYOffset || document.documentElement.scrollTop;

    if ((top > viewportHeight) && (!scrollTop.classList.contains('scroll-top--visible'))) {
      scrollTop.classList.add('scroll-top--visible');
    }

    if ((top < viewportHeight) && (scrollTop.classList.contains('scroll-top--visible'))) {
      scrollTop.classList.remove('scroll-top--visible');
    }
  };

  window.addEventListener('scroll', debounce(handleScroll, 10));
});
