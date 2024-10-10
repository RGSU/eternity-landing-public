import Swiper from 'swiper';
import {
  Navigation, Pagination, Autoplay, Mousewheel,
} from 'swiper/modules';

const initCarousel = (component) => {
  const carouselOptions = {
    modules: [Navigation, Pagination, Autoplay, Mousewheel],
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 700,
    autoplay: false,
    mousewheel: {
      enabled: true,
      releaseOnEdges: true,
    },
    // breakpoints: {
    //   1280: {
    //     spaceBetween: 12,
    //   },
    // },
  };

  const dataAutoplay = component.hasAttribute('data-autoplay') ? +component.getAttribute('data-autoplay') || 5000 : false;
  if (dataAutoplay) {
    carouselOptions.autoplay = {
      delay: dataAutoplay,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    };
  }

  const dataPagination = component.hasAttribute('data-pagination');
  if (dataPagination) {
    carouselOptions.pagination = {
      el: component.querySelector('.carousel__pagination'),
      dynamicBullets: false,
      clickable: true,
    };
  }

  const dataNavigation = component.hasAttribute('data-navigation');
  if (dataNavigation) {
    carouselOptions.navigation = {
      nextEl: component.querySelector('.carousel__button-next'),
      prevEl: component.querySelector('.carousel__button-prev'),
    };
  }

  if (component.classList.contains('carousel--media')) {
    carouselOptions.slidesPerView = 1;
    carouselOptions.breakpoints = {
      700: {
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 3,
      },
    };
  }

  component.swiper = new Swiper(component, carouselOptions);

  // Найти элементы счетчиков
  const totalCounter = component.querySelector('.carousel__counter-total');
  const currentCounter = component.querySelector('.carousel__counter-current');

  if (totalCounter && currentCounter) {
    const updateCounters = () => {
      totalCounter.textContent = ` / ${component.swiper.slides.length}`;
      currentCounter.textContent = component.swiper.activeIndex + 1;
    };

    updateCounters();

    component.swiper.on('slideChange', updateCounters);
  }
};

window.initCarousel = initCarousel;

document.querySelectorAll('.carousel').forEach((el) => {
  initCarousel(el);
});
