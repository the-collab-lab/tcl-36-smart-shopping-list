import React from 'react';

export default function Modal() {
  const [showModal, setShowModal] = React.useState(false);

  const renderAboutText = () => {
    return (
      <div className="text-mostlyBlack">
        <ul className="list-disc">
          <li>
            Here for the first time? Click <strong>Get Started</strong> to start
            a new list and add your items.
          </li>
          <li>
            If you're looking to join an existing list, click{' '}
            <strong>Join List</strong> to enter your code.
          </li>
          <li>
            Once you add items to your list, you can see your items by going to{' '}
            <strong>List View</strong>.
          </li>
          <li>
            You will have the option to check items off as you purchase them.
            When you're done, click <strong>Submit checked items</strong> to
            save your changes.
          </li>
          <li>
            Over time, you will see your items automagically move into different
            groups based on how often you purchase them. Before you know it,
            you'll be a smart shopper!
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <button
        className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Learn More
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex ml-0 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-mostlyBlack">
                    Welcome to Smart Shopper!
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent text-mostlyBlack border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-mostlyBlack h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  {renderAboutText()}
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-rose-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black w-screen"></div>
        </>
      ) : null}
    </>
  );
}
