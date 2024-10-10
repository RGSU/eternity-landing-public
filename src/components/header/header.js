import HeaderComponent from './HeaderComponent.js';

const header = document.querySelector('.header');
if (header) {
  header.headerComponent = new HeaderComponent(header);
}
