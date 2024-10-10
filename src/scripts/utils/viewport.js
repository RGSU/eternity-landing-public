export const viewportHeight = () => window.innerHeight || document.documentElement.clientHeight;

export const viewportWidth = () => window.innerWidth || document.documentElement.clientWidth;

// Determine if an element is in the viewport
export const isInViewport = (elem) => {
  const distance = elem.getBoundingClientRect();
  return (
    distance.top >= 0
    && distance.left >= 0
    && distance.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && distance.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
