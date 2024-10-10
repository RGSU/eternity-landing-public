import { isTouchDevice } from '../utils/device.js';

if (isTouchDevice()) {
  document.documentElement.classList.add('touch');
} else {
  document.documentElement.classList.add('no-touch');
}
