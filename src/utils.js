// user selects one of these options when first adding an item to a list
export const radioButtonOptions = [
  {
    option: 'soon',
    value: 7,
    defaultChecked: true,
  },
  {
    option: 'kind of soon',
    value: 14,
    defaultChecked: false,
  },
  {
    option: 'not soon',
    value: 30,
    defaultChecked: false,
  },
];

//used to normalize item names when added by a user
export const removePunctuation = (string) => {
  const punctuationlessString = string
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .join('');

  return punctuationlessString;
};

// general variables used for time calculations
export const currentTime = Date.now();
export const oneDay = 86400000;

// used to determine if a checkbox can be unchecked
export const within24hours = (date) => {
  let timeCheck = false;

  const gap = currentTime - date;
  if (gap < oneDay) {
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

//might want to adjust these styles or take them out and replace with tailwind classes..
export const navStyles = {
  position: 'fixed',
  bottom: '0',
  width: '100%',
  textAlign: 'center',
  backgroundColor: '#fff',
};
