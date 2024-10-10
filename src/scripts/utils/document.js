export const getDocumentHeight = () => Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.body.clientHeight,
  document.documentElement.clientHeight,
);

// Get the distance the user has scrolled from the top of the page.
// var distance = window.pageYOffset;
export const getScrollTop = () => (document.body.scrollTop || document.documentElement.scrollTop);
