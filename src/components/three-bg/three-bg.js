import * as THREE from 'three';

let scene; let camera; let renderer; let stars; let starGeo;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const positions = starGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] += 0.08; // Двигаем частицы вперед по оси Z

    if (positions[i + 2] > 200) {
      positions[i + 2] = -200; // Перемещаем частицу обратно за камеру
    }
  }

  starGeo.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202124);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.classList.add('three-bg');
  document.querySelector('.page').appendChild(renderer.domElement);

  starGeo = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 1000; i += 1) {
    positions.push(
      Math.random() * 600 - 300, // X
      Math.random() * 600 - 300, // Y
      Math.random() * 600 - 300, // Z
    );
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const sprite = new THREE.TextureLoader().load('assets/img/star.png');
  const starMaterial = new THREE.PointsMaterial({
    size: 0.7,
    map: sprite,
    transparent: true,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  window.addEventListener('resize', onWindowResize, false);

  animate();
}

init();
