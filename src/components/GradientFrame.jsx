import React from 'react';

// Reusable gradient styling used for frames around groups in ListLayout component
function GradientFrame({ children, colorClass }) {
  return (
    <section
      className={`rounded-3xl  mx-auto  mt-6 p-2 bg-gradient-to-b ${colorClass}`}
    >
      <div className="flex flex-col justify-between  py-10 bg-white rounded-3xl p-4">
        {children}
      </div>
    </section>
  );
}

export default GradientFrame;
