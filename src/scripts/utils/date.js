export const ruFormatToDate = (value) => {
  const [day, month, year] = value.split('.');
  return new Date(+year, +month - 1, +day);
};

export const dateToRuFormat = (date) => {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  return `${dd}.${mm}.${yyyy}`;
};

export const isoFormatToDate = (value) => Date.parse(value);

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const removeDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setDate(result.getMonth() + months);
  return result;
};

export const removeMonths = (date, months) => {
  const result = new Date(date);
  result.setDate(result.getMonth() - months);
  return result;
};

export const isDateValid = (date) => !Number.isNaN(date.valueOf());
