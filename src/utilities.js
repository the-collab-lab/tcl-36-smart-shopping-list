//used to normalize item names when added by a user
export const normalizeItemName = (string) => {
  const punctuationlessString = string
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .join('');

  return punctuationlessString;
};

export const ONE_DAY_IN_MILLISECONDS = 86400000;

// used to determine if a checkbox can be unchecked
export const isWithin24hours = (date) => {
  let currentTime = Date.now();
  let timeCheck = false;

  const gap = currentTime - date;
  if (gap < ONE_DAY_IN_MILLISECONDS) {
    timeCheck = true;
  }
  return timeCheck;
};
