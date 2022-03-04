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

// used in ListLayout to determine how items are sorted by status
export const itemStatusGroups = [
  {
    label: 'Soon',
    sublabel: "We think you'll need this in less than 7 days",
    groupFilter: (item) => {
      return item.previousEstimate < 7 && item.isActive === true;
    },
    colorClass: 'bg-white border-8 border-teal-500',
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
    colorClass: 'bg-white border-8 border-amber-300',
  },
  {
    label: 'Not soon',
    sublabel: "We think you'll need this in more than 30 days",
    groupFilter: (item) => {
      return item.previousEstimate >= 30 && item.isActive === true;
    },
    colorClass: 'bg-white border-8 border-rose-500',
  },
  {
    label: 'Inactive',
    sublabel: "This item hasn't been purchased recently",
    groupFilter: (item) => {
      return item.isActive === false;
    },
    colorClass: 'bg-white border-8 border-gray-500',
  },
];
