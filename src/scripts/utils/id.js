/* eslint-disable */

export const forceUniqID = (element, prefix) => {
  if (!element) return '';

  let str = prefix || "";
  const id = element.getAttribute("id") || "";

  if (str.length) {
    str = str + "-";
  } else if (id.length > 0){
    str = id + "-";
  };

  str = str + Math.random().toString(36).substring(2, 9);
  element.setAttribute("id", str);
  return str;
};
