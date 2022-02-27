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

//TODO remove this from Navigatio component and replace with Tailwind classes
export const navButtonStyles = {
  position: 'fixed',
  bottom: '0',
  width: '100%',
  textAlign: 'center',
  backgroundColor: '#fff',
};
