import * as THREE from 'three';

if (document.querySelector('.face-canvas')) {
  {
    let body,
      mainContainer,
      scene,
      renderer,
      camera,
      cameraLookAt = new THREE.Vector3(0, 0, 0),
      cameraTarget = new THREE.Vector3(0, 0, 800),
      windowWidth = window.innerWidth, // Задаем ширину окна равной ширине экрана
      windowHeight = window.innerHeight, // Задаем высоту окна равной высоте экрана
      sceneWidth = 705, // Фиксированная ширина сцены под размер изображения
      sceneHeight = 705, // Фиксированная высота сцены под размер изображения
      sceneAspectRatio = sceneWidth / sceneHeight,
      windowHalfWidth = windowWidth / 2,
      windowHalfHeight = windowHeight / 2,
      particles = [],
      graphicCanvas,
      gctx,
      canvasWidth = sceneWidth,
      canvasHeight = sceneHeight,
      graphicPixels,
      graphicOffsetX,
      graphicOffsetY,
      mouseX = 0,
      mouseY = 0,
      maxScrollDistance = window.innerHeight // Максимальная дистанция для прокрутки
      // lastScrollTime = Date.now(),
      // scrollCooldown = 500; // Время задержки, после которого частицы остановятся

    // -----------------------
    // Setup stage
    // -----------------------
    const initStage = () => {
      body = document.querySelector('body');
      mainContainer = document.querySelector('.face-canvas'); // Используем существующий контейнер

      // Устанавливаем размеры контейнера канваса
      if (mainContainer) {
        mainContainer.style.width = '100%';
        mainContainer.style.height = '100%';
      }

      window.addEventListener('resize', onWindowResize, false);
      window.addEventListener('scroll', onWindowScroll, false);
      window.addEventListener('mousemove', onMouseMove, false);
    };

    // -----------------------
    // Setup scene
    // -----------------------
    const initScene = () => {
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({
        alpha: true, // Сделать фон прозрачным
        antialias: true,
      });

      // Устанавливаем размеры рендера на полную ширину и высоту окна
      renderer.setSize(windowWidth, windowHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Проверяем наличие mainContainer перед добавлением DOM-элемента
      if (mainContainer) {
        mainContainer.appendChild(renderer.domElement);
      }

      scene.background = null; // Прозрачный фон
    };

    // -----------------------
    // Setup camera
    // -----------------------
    const initCamera = () => {
      const fieldOfView = 45;
      const aspectRatio = windowWidth / windowHeight; // Соотношение сторон сцены
      const nearPlane = 1;
      const farPlane = 7000;

      camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
      );

      // Устанавливаем камеру так, чтобы охватить сцену размером 705x705 пикселей
      camera.position.z = 3000; // Уменьшено расстояние, чтобы частицы были ближе
      camera.updateProjectionMatrix();
    };

    // -----------------------
    // Setup canvas
    // -----------------------
    const initCanvas = () => {
      graphicCanvas = document.createElement('canvas');
      graphicCanvas.width = canvasWidth;
      graphicCanvas.height = canvasHeight;

      gctx = graphicCanvas.getContext('2d');
      const graphics = document.querySelectorAll('.face-canvas__img');
      const currentGraphic = 0;
      const img = graphics[currentGraphic];

      gctx.clearRect(0, 0, canvasWidth, canvasHeight); // Очищаем холст перед отрисовкой нового изображения
      gctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      const gData = gctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
      graphicPixels = [];

      for (let y = 0; y < canvasHeight; y += 1) {
        // Шаг уменьшен до 1 для более плотного покрытия
        for (let x = 0; x < canvasWidth; x += 1) {
          // Шаг уменьшен до 1 для более плотного покрытия
          const index = (x + y * canvasWidth) * 4;
          const r = gData[index];
          const g = gData[index + 1];
          const b = gData[index + 2];
          const a = gData[index + 3];

          // Используем альфа-канал и яркость для выбора пикселей
          const brightness = (r + g + b) / 3;
          if (a > 50 && brightness > 10) {
            // Если пиксель непрозрачен и достаточно яркий
            graphicPixels.push({ x: x, y: y });
          }
        }
      }

      graphicOffsetX = canvasWidth / 2;
      graphicOffsetY = canvasHeight / 2;
    };

    // -----------------------
    // Setup light
    // -----------------------
    const initLights = () => {
      const shadowLight = new THREE.DirectionalLight(0xffffff, 2);
      shadowLight.position.set(20, 0, 10);
      scene.add(shadowLight);

      const light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(-20, 0, 20);
      scene.add(light);

      const backLight = new THREE.DirectionalLight(0xffffff, 1);
      backLight.position.set(0, 0, -20);
      scene.add(backLight);
    };

    // -----------------------
    // Setup particles
    // -----------------------
    function Particle() {
      this.vx = Math.random() * 0.01; // Увеличен угол поворота по оси x
      this.vy = Math.random() * 0.01; // Увеличен угол поворота по оси y
      this.originalPosition = new THREE.Vector3();
      this.randomPosition = new THREE.Vector3();
      this.hasMoved = false;
    }

    Particle.prototype.init = function (i, texture) {
      const materialCore = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff, // Белый цвет частиц
        transparent: true, // Прозрачный фон для текстуры
      });

      const sprite = new THREE.Sprite(materialCore);

      const pos = getGraphicPos(graphicPixels[i]);
      sprite.targetPosition = new THREE.Vector3(pos.x, pos.y, pos.z);

      sprite.position.set(
        sceneWidth * 0.5,
        sceneHeight * 0.5,
        -10 * Math.random() + 20
      );
      randomPos(sprite.position);

      sprite.scale.set(1.5, 1.5, ); // Задаем размер спрайта меньше для большего количества частиц
      this.particle = sprite;
      this.originalPosition.copy(sprite.targetPosition); // Сохраняем оригинальную позицию
    };

    Particle.prototype.updateRotation = function () {
      this.particle.rotation.x += this.vx;
      this.particle.rotation.y += this.vy;
    };

    Particle.prototype.updatePosition = function (scrollFactor) {
      const maxScatterDistance = 3000; // Увеличен максимальный разброс частиц

      // if (Date.now() - lastScrollTime > scrollCooldown) {
      //   // Если скролл давно не происходил, частицы остаются на месте
      //   scrollFactor = 1;
      // }

      // Убираем случайные отклонения, чтобы частицы стремились обратно к своим оригинальным позициям
      const offsetX = (1 - scrollFactor) * (this.originalPosition.x - this.particle.position.x);
      const offsetY = (1 - scrollFactor) * (this.originalPosition.y - this.particle.position.y);

      if (!this.hasMoved) {
        this.randomPosition.set(
          (Math.random() - 0.5) * maxScatterDistance,
          (Math.random() - 0.5) * maxScatterDistance,
          Math.random() * maxScatterDistance
        );
        this.hasMoved = true;
      }

      const targetPosition = new THREE.Vector3().lerpVectors(this.originalPosition, this.randomPosition, scrollFactor);

      // Линейная интерполяция позиции с учетом scrollFactor
      this.particle.targetPosition.x = targetPosition.x + offsetX;
      this.particle.targetPosition.y = targetPosition.y + offsetY;

      // Ограничиваем движение частиц
      this.particle.targetPosition.x = Math.max(Math.min(this.particle.targetPosition.x, maxScatterDistance), -maxScatterDistance);
      this.particle.targetPosition.y = Math.max(Math.min(this.particle.targetPosition.y, maxScatterDistance), -maxScatterDistance);

      this.particle.position.lerp(this.particle.targetPosition, 0.06);
    };

    function updateParticles(scrollFactor) {
      for (let i = 0, l = particles.length; i < l; i++) {
        particles[i].updateRotation();
        particles[i].updatePosition(scrollFactor);
      }
    }

    const getGraphicPos = (data) => {
      return {
        x: data.x - graphicOffsetX,
        y: canvasHeight - data.y - graphicOffsetY,
        z: 0,
      };
    };

    const setParticles = (texture) => {
      for (let i = 0, l = graphicPixels.length; i < l; i++) {
        if (particles[i]) {
          const pos = getGraphicPos(graphicPixels[i]);
          particles[i].particle.targetPosition.x = pos.x;
          particles[i].particle.targetPosition.y = pos.y;
          particles[i].particle.targetPosition.z = pos.z;
          particles[i].originalPosition.copy(particles[i].particle.targetPosition); // Сохраняем оригинальную позицию
        } else {
          const p = new Particle();
          p.init(i, texture);
          scene.add(p.particle);
          particles[i] = p;
        }
      }

      for (let i = graphicPixels.length; i < particles.length; i++) {
        randomPos(particles[i].particle.targetPosition, true);
      }

      // console.log('Total Particles: ' + particles.length);
    };

    // -----------------------
    // Random position
    // -----------------------
    function randomPos(vector, outFrame = false) {
      const radius = outFrame ? sceneWidth * 2 : sceneWidth * -2;
      const centerX = 0;
      const centerY = 0;

      // ensure that p(r) ~ r instead of p(r) ~ constant
      const r = sceneWidth + radius * Math.random();
      const angle = Math.random() * Math.PI * 2;

      // compute desired coordinates
      vector.x = centerX + r * Math.cos(angle);
      vector.y = centerY + r * Math.sin(angle);
      vector.z = Math.random() * sceneWidth;
    }

    // -----------------------
    // Mouse and Window events
    // -----------------------
    const onMouseMove = (event) => {
      mouseX = event.clientX - windowHalfWidth;
      mouseY = event.clientY - windowHalfHeight;
      cameraTarget.x = mouseX * -0.1; // Значительно уменьшили влияние мыши
      cameraTarget.y = mouseY * 0.1; // Значительно уменьшили влияние мыши
    };

    const onWindowResize = () => {
      setWindowSize();

      camera.aspect = windowWidth / windowHeight; // Обновляем соотношение сторон камеры для сцены
      camera.updateProjectionMatrix();
      renderer.setSize(windowWidth, windowHeight);
      initCanvas(); // Пересоздать канвас с новым размером окна
      loadTexture(); // Загрузить текстуру и обновить частицы
    };

    const onWindowScroll = () => {
      // lastScrollTime = Date.now(); // Обновляем время последнего скролла
      const scrollY = window.scrollY;
      const scrollFactor = Math.min(scrollY / maxScrollDistance, 1); // Фактор прокрутки

      updateParticles(scrollFactor);
    };

    const setWindowSize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      windowHalfWidth = windowWidth / 2;
      windowHalfHeight = windowHeight / 2;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const scrollY = window.scrollY;
      const scrollFactor = Math.min(scrollY / maxScrollDistance, 1); // Фактор прокрутки
      updateParticles(scrollFactor);
      camera.position.lerp(cameraTarget, 0.1);
      camera.lookAt(cameraLookAt);
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    const loadTexture = () => {
      const loader = new THREE.TextureLoader();
      loader.load('assets/img/star.png', (texture) => {
        setParticles(texture);
      });
    };

    initStage();
    initScene();
    initCanvas();
    initCamera();
    initLights(); // Важно инициализировать освещение

    loadTexture();
    animate();
  }

}
