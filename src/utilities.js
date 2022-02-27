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

// used in ListLayout to determine how items are sorted by status
export const groups = [
  {
    label: 'Soon',
    sublabel: "We think you'll need this in less than 7 days",
    groupFilter: (item) => {
      return item.previousEstimate < 7 && item.isActive === true;
    },
    colorClass: 'bg-rose-100',
  },
  {
    label: 'Kind of soon',
    sublabel: "We think you'll need this in less than 30 days",
    groupFilter: (item) => {
      return (
        item.previousEstimate >= 7 &&
        item.previousEstimate < 30 &&
        item.isActive === true
      );
    },
    colorClass: 'bg-yellow-100',
  },
  {
    label: 'Not soon',
    sublabel: "We think you'll need this in more than 30 days",
    groupFilter: (item) => {
      return item.previousEstimate >= 30 && item.isActive === true;
    },
    colorClass: 'bg-green-100',
  },
  {
    label: 'Inactive',
    sublabel: "This item is inactive and hasn't been purchased recently",
    groupFilter: (item) => {
      return item.isActive === false;
    },
    colorClass: 'bg-gray-200',
  },
];
