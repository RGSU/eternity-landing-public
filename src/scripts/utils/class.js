const removeClassesByPrefix = (element, prefix) => {
  for (let i = element.classList.length - 1; i >= 0; i -= 1) {
    if (element.classList[i].startsWith(prefix)) {
      element.classList.remove(element.classList[i]);
    }
  }
};

export default removeClassesByPrefix;
