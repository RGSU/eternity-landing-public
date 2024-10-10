export const checkWebpSupport = () => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => { resolve(); };
  img.onerror = () => { reject(); };
  img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
});

export const canUseWebp = () => {
  const elem = document.createElement('canvas');
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};
