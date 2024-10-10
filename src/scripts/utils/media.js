/* eslint-disable */

// Check to see if user prefers reduced motion
export const prefersReducedMotion = () => {
  if ('matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches) {
    return true;
  };
  return false;
};
