/* eslint-disable */

// Get the height of an element.
export const getHeight = (elem) => parseInt(window.getComputedStyle(elem).height, 10);

export const getHiddenElementHeight = (element) => {
  const clone = element.cloneNode(true);
  let height = 0;
  const style = `
    display: block;
    width: ${element.clientWidth}px;
    position: absolute;
    top: 0;
    left: -999rem;
    max-height: none !important;
    height: auto;
    visibility: hidden;
`;

  clone.setAttribute('style', style);
  element.parentElement.append(clone);
  height = clone.clientHeight;
  clone.remove();

  return height;
};

// Get an element's distance from the top of the Document.
export const getOffsetTop = (elem) => {
  let location = 0;
  if (elem.offsetParent) {
    while (elem) {
      location += elem.offsetTop;
      // elem = elem.offsetParent;
    }
  }
  return location >= 0 ? location : 0;
};

export const wrapElement = (element, wrapper) => {
  wrapper = wrapper || document.createElement('div');
  element.parentNode.appendChild(wrapper);
  return wrapper.appendChild(element);
};

/*!
 * Get all of an element's parent elements up the DOM tree
 * @param  {Node}     elem     The element
 * @param  {Function} callback The test condition
 * @return {Array}             The parent elements
 */
export const getParents = (elem, callback) => {

  let parents = [];
  let parent = elem.parentNode;
  let index = 0;

  if (typeof callback !== 'function') {
    callback = null;
  }

  while (parent && parent !== document) {
    if (callback) {
      if (callback(parent, index, elem)) {
        parents.push(parent);
      }
    } else {
      parents.push(parent);
    }

    index++;
    parent = parent.parentNode;
  }

  return parents;

};
