/* eslint-disable */

// Merge two or more objects together
export const extendObjects = () => {
  var merged = {};
  Array.prototype.forEach.call(arguments, function (obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) return;
      merged[key] = obj[key];
    }
  });
  return merged;
};
