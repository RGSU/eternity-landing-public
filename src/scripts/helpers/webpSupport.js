import { checkWebpSupport } from '../utils/webp.js';

const html = document.documentElement;
if (checkWebpSupport()) {
  html.classList.add('webp');
  html.classList.remove('no-webp');
} else {
  html.classList.add('no-webp');
  html.classList.remove('webp');
}
