export const exportAnimations = [];
export const animationStates = [];

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  function isIPhone() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  // General function to apply fade-in animations
  function applyFadeInAnimation(elements, startOffset = 50, triggerOffset = 'top 90%', delayFactor = 0.1) {
    elements.forEach((el, index) => {
      gsap.set(el, { y: startOffset, opacity: 0 });
      const anim = gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        paused: true,
        delay: index * delayFactor,
      });

      ScrollTrigger.create({
        trigger: el,
        start: triggerOffset,
        onEnter: () => anim.play(),
        once: true,
      });
    });
  }

  // Apply animations to different sections
  applyFadeInAnimation(gsap.utils.toArray('.tariffs-card'));
  applyFadeInAnimation(gsap.utils.toArray('.product-card'));
  applyFadeInAnimation(gsap.utils.toArray('.media-card'));
  applyFadeInAnimation(gsap.utils.toArray('.faq__item'), 90, 'top 90%', 0);

  // Function to set up scroll-based width change for images
  function setScrollWidthAnimation(elements, startOffset = '900px', endOffset = '1360px') {
    elements.forEach((el) => {
      gsap.set(el, { maxWidth: endOffset });
      gsap.to(el, {
        maxWidth: startOffset,
        scrollTrigger: {
          trigger: el,
          scrub: true,
          start: el.offsetHeight - 100,
        },
      });
    });
  }

  setScrollWidthAnimation(gsap.utils.toArray('.news-section__img'));

  // Visual backgrounds with scroll-based animation
  function applyVisualBgAnimation(elements, startY = 250) {
    elements.forEach((visual) => {
      gsap.set(visual, { y: startY });
      gsap.to(visual, {
        y: 0,
        scrollTrigger: {
          trigger: visual,
          scrub: true,
        },
      });
    });
  }

  applyVisualBgAnimation(gsap.utils.toArray('.products__visual-bg'));
  applyVisualBgAnimation(gsap.utils.toArray('.media__visual-bg'));
  applyVisualBgAnimation(gsap.utils.toArray('.manual__visual-bg'), -250);

  // Text split into spans for about section and animation by letters
  function splitTextIntoSpans(element) {
    const text = element.textContent;
    const wrappedText = text.split('').map((letter) => `<span>${letter}</span>`).join('');
    element.innerHTML = wrappedText;
  }

  const aboutItems = gsap.utils.toArray('.about__item');
  aboutItems.forEach((item, index) => {
    item.querySelectorAll('.about__item-title').forEach(splitTextIntoSpans);
    applyFadeInAnimation([item], 100);

    const title = item.querySelector('.about__item-title');
    if (title) {
      const letters = title.querySelectorAll('span');
      gsap.fromTo(
        letters,
        { opacity: 0.2 },
        {
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: title,
            start: 'top 60%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );
    }
  });

  // Update card triggers with unique IDs
  function updateCardTriggers() {
    const cards = gsap.utils.toArray('.manual__card');
    const spacer = 10;
    const minScale = 0.8;
    const distributor = gsap.utils.distribute({ base: minScale, amount: 0.2 });

    cards.forEach((card, index) => {
      const scaleVal = distributor(index, cards[index], cards);

      // Scale animation
      gsap.to(card, {
        scale: scaleVal,
        scrollTrigger: {
          trigger: card,
          start: 'top+=100 top',
          scrub: true,
          invalidateOnRefresh: true,
          id: `card-scale-${index}`,
        },
        ease: 'none',
      });

      // Blur animation (for all except the last card)
      if (cards.length !== index + 1) {
        gsap.to(card, {
          filter: 'blur(12px)',
          scrollTrigger: {
            trigger: card,
            start: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
            id: `card-blur-${index}`,
          },
          ease: 'none',
        });
      }

      // Pin animation
      ScrollTrigger.create({
        trigger: card,
        start: `top-=${index + 1 * spacer} top`,
        endTrigger: '.manual',
        end: `bottom top+=${card.offsetHeight + (cards.length * spacer)}`,
        pin: true,
        pinSpacing: false,
        id: `card-pin-${index}`,
        invalidateOnRefresh: true,
        // markers: true
      });
    });
  }

  // Configure ScrollTrigger globally
  ScrollTrigger.config({
    fastScrollEnd: true, // Allows for faster scroll updates
    refreshInterval: 16,  // 60fps-like refresh rate
  });

  // Add 'will-change' to improve performance on iOS
  document.querySelectorAll('.manual__card').forEach(card => {
    card.style.willChange = 'transform';
  });

  updateCardTriggers();


  // Update table triggers with unique IDs
  function updateTableTriggers() {
    const tableWrappers = gsap.utils.toArray('.tariffs-table__wrapper');
    tableWrappers.forEach((tableWrapper) => {
      const tables = tableWrapper.querySelectorAll('.tariffs-table');
      tables.forEach((table) => {
        const thead = table.querySelector('.tariffs-table__head');

        ScrollTrigger.create({
          trigger: table,
          start: 'top top',
          end: `bottom-=${thead.offsetHeight + 26}`,
          pin: thead,
          pinSpacing: false,
          id: `table-trigger-${Math.random()}`, // Ensure unique ID for each table trigger
          invalidateOnRefresh: true,
        });
      });
    });
  }

  updateTableTriggers();

   // КАРУСЕЛЬ АМБАССАДОРОВ =====================================================================

   function initWheelCarousel(carousel, index) {
    const wrapper = carousel.querySelector('.wheel-carousel-wrapper');
    let originalSlides = gsap.utils.toArray(carousel.querySelectorAll('.wheel-carousel-slide'));
    const circlePath = MotionPathPlugin.convertToPath(carousel.querySelector('.wheel-carousel-path__path'), false)[0];
    circlePath.id = `circlePath-${index}`;

    originalSlides[0].classList.add('active');
    originalSlides.forEach((slide, index) => {
      slide.dataset.index = index + 1;
    });
    let counterTotal = carousel.querySelector('.wheel-carousel-counter-total');
    if (counterTotal) {
      counterTotal.textContent =  `/ ${originalSlides.length}`;
    }

    // Увеличиваем количество слайдов до тех пор, пока оно не превысит 35, сохраняя кратность
    const slideCount = originalSlides.length;
    if (slideCount < 35) {
      const multiplier = Math.ceil(35 / slideCount);
      const targetSlideCount = slideCount * multiplier;

      // Если после умножения получилось больше 35, уменьшаем на один цикл
      let finalSlideCount = targetSlideCount;
      if (targetSlideCount > 35) {
        finalSlideCount = (multiplier - 1) * slideCount;
      }

      // Количество слайдов не превышает 35 и кратно изначальному количеству слайдов
      let additionalSlides = [];
      for (let i = 0; i < Math.floor(finalSlideCount / slideCount); i++) {
        additionalSlides = additionalSlides.concat(originalSlides);
      }

      originalSlides = originalSlides.concat(additionalSlides).slice(0, finalSlideCount);
    }

    // Убираем только слайды из wrapper
    wrapper.querySelectorAll('.wheel-carousel-slide').forEach(slide => slide.remove());

    // Добавляем увеличенное количество слайдов в wrapper
    originalSlides.forEach(slide => {
      wrapper.appendChild(slide.cloneNode(true));
    });

    let slides = gsap.utils.toArray(wrapper.querySelectorAll('.wheel-carousel-slide'));

    carousel.querySelector(".wheel-carousel-path").prepend(circlePath);
    const slidesAmount = slides.length;
    const step = 360 / slidesAmount;
    let activeIndex = 0;
    let endRotation = 0;

    let resizeTimeout;

    gsap.set(slides, {
      motionPath: {
        path: circlePath,
        align: circlePath,
        alignOrigin: [0.5, 0.5],
        start: -0.25,
        end: (i) => i / slidesAmount - 0.25,
        autoRotate: true
      }
    });

    window.addEventListener('resize', () => {
      // Очистить предыдущий таймаут, если он существует
      clearTimeout(resizeTimeout);

      // Установить новый таймаут на 500 мс
      resizeTimeout = setTimeout(() => {
        gsap.set(slides, {
          motionPath: {
            path: circlePath,
            align: circlePath,
            alignOrigin: [0.5, 0.5],
            start: -0.25,
            end: (i) => i / slidesAmount - 0.25,
            autoRotate: true
          }
        });
      }, 200); // Задержка в 500 мс
    });


    // Получаем текущие координаты Y слайдов на круговой траектории
    let currentYValues = [];
    let animSlides = [
      slides[slides.length - 3],
      slides[slides.length - 2],
      slides[slides.length - 1],
      slides[0],
      slides[1],
      slides[2],
      slides[3],
    ];
    animSlides.forEach(slide => {
      currentYValues.push(gsap.getProperty(slide, "y"));
    });
    animSlides.forEach((slide, index) => {
      // Рассчитываем смещение для анимации
      let startY = 80;  // Начальная позиция, ниже текущей позиции
      let currentY = currentYValues[index] || 0;
      gsap.set(slide, { y: currentY + startY, opacity: 0 });

      // Создаем анимацию для плавного появления элемента вверх
      const anim = gsap.to(slide, {
        y: currentY,  // Переход к текущей позиции
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: index * 0.1,
        paused: true,
      });

      ScrollTrigger.create({
        trigger: slide,
        start: 'top 90%',
        onEnter: () => anim.play(),
        once: true,
      });
    });

    function updateActiveSlide() {
      slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === activeIndex);

        let counterCurrent = carousel.querySelector('.wheel-carousel-counter-current');
        if (counterCurrent && slide.classList.contains('active')) {
          counterCurrent.textContent = slide.dataset.index;
        }
      });
    }

    function rotateCarousel(direction) {
      let oldActiveIndex = activeIndex;
      let isCan = true;
      if (activeIndex === 0 && direction === 1) {
        isCan = false;
        gsap.set(wrapper, {
          rotation: 360,
          onComplete: () => {
            isCan = true;
          }
        });
      }
      if (activeIndex === 0 && direction === -1) {
        isCan = false;
        gsap.set(wrapper, {
          rotation: 0,
          onComplete: () => {
            isCan = true;
          }
        });
      }
      activeIndex = (activeIndex + direction + slidesAmount) % slidesAmount;
      let targetRotation = -activeIndex * step;
      if (targetRotation <= 0) {
        targetRotation += 360;
      } else if (targetRotation >= 360) {
        targetRotation -= 360;
      }
      if (oldActiveIndex === 1 && direction === -1) {
        targetRotation = 360;
      }
      if (oldActiveIndex === (slidesAmount - 1) && direction === 1) {
        targetRotation = 0;
      }
      if (direction === 0) {
        const diff1 = Math.abs(targetRotation - endRotation);
        if (endRotation < diff1) {
          targetRotation = 0;
        }
      }

      if (isCan) {
        gsap.to(wrapper, {
          rotation: targetRotation,
          duration: 1,
          ease: "power2.out",
          onUpdate: updateActiveSlide
        });
      }
    }

    Draggable.create(wrapper, {
      type: "rotation",
      onDrag: function() {
        let currentRotation = (gsap.getProperty(wrapper, "rotation") % 360 + 360) % 360;
        activeIndex = Math.round(currentRotation / step) % slidesAmount;
        activeIndex = (slidesAmount - activeIndex) % slidesAmount;  // Ensure positive index
        gsap.set(wrapper, {
          rotation: currentRotation,
        });
        updateActiveSlide();
      },
      onDragEnd: function() {
        endRotation = (gsap.getProperty(wrapper, "rotation") % 360 + 360) % 360;
        activeIndex = Math.round(endRotation / step) % slidesAmount;
        activeIndex = (slidesAmount - activeIndex) % slidesAmount;  // Ensure positive index
        rotateCarousel(0); // Snap to the nearest slide
      }
    });

    carousel.querySelector(".wheel-carousel-prev").addEventListener("click", () => rotateCarousel(-1));
    carousel.querySelector(".wheel-carousel-next").addEventListener("click", () => rotateCarousel(1));

    updateActiveSlide();
  }

  document.querySelectorAll('.wheel-carousel').forEach((el, index) => {
    initWheelCarousel(el, index);
  });

  // Функция для дебаунса (отсрочка выполнения функции)
  // function debounce(func, delay) {
  //   let timeout;
  //   return (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), delay);
  //   };
  // }

  let resizeTimeout;
  let lastWindowWidth = window.innerWidth;
  let lastWindowHeight = window.innerHeight;

  const handleResize = () => {
    if (!document.body.classList.contains('is-scroll-locked')) {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Проверяем, изменился ли размер окна
      if (currentWidth !== lastWindowWidth || currentHeight !== lastWindowHeight) {
        lastWindowWidth = currentWidth;
        lastWindowHeight = currentHeight;

        // Убиваем и обновляем триггеры для таблиц и карточек
        ScrollTrigger.getAll().forEach(trigger => {
          const { id } = trigger.vars;

          if (id?.includes('table-trigger') || id?.includes('card-scale') || id?.includes('card-blur') || id?.includes('card-pin')) {
            trigger.kill();
          }
        });

        // Обновление триггеров
        updateTableTriggers();
        updateCardTriggers();

        // Обновляем ScrollTrigger
        ScrollTrigger.refresh();
      }
    }
  };

  // Добавляем слушатель события resize с дебаунсом на 300 мс
  if (!isIPhone()) {
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(handleResize);
      console.log('yes')
    });
  }

  const footerItems = gsap.utils.toArray('.footer-anim');
  footerItems.forEach((item, index) => {
    // Разные начальные состояния и анимации для каждого элемента
    const animations = [
      { y: 50, opacity: 0 },
      { y: 120, opacity: 0 },
      { y: 20, opacity: 0 },
    ];

    const animationConfig = animations[index % animations.length];
    const { x = 0, y = 0, opacity = 1 } = animationConfig;

    // Установить начальное состояние элемента
    gsap.set(item, { x, y, opacity });

    // Создать анимацию для плавного появления элемента
    const anim = gsap.to(item, {
      x: 0, y: 0, opacity: 1, duration: 1 + index * 0.2, ease: 'power2.out', paused: true,
    });

    ScrollTrigger.create({
      trigger: item,
      start: 'top bottom 90%',
      // markers: true,
      onEnter: () => anim.play(),
      once: true,
    });
  });
});
