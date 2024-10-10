import PopupComponent from './PopupComponent.js';

const popupOptions = {
  fixHeaderPadding: true,
};

window.Popup = new PopupComponent(popupOptions);

if (window.location.hash.indexOf('#popup') !== -1) {
  window.Popup.open(window.location.hash);
}

// window.Popup.addEventListener('beforeOpen', () => {
//   console.log('beforeOpen', window.Popup.dialog);
// });

// window.Popup.addEventListener('open', () => {
//   console.log('open', window.Popup.dialog);
// });

// window.Popup.addEventListener('beforeClose', () => {
//   console.log('beforeClose', window.Popup.dialog);
// });

// window.Popup.addEventListener('close', () => {
//   console.log('close', window.Popup.dialog);
// });
