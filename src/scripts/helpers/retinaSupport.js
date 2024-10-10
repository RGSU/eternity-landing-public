import checkRetinaSupport from '../utils/retina.js';

if (checkRetinaSupport()) {
  document.documentElement.classList.add('retina');
}
