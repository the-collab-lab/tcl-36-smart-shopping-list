import React from 'react';

const Header = () => {
  return (
    <header className="flex-col align-items-center justify-items-center my-6">
      <section className="hero container max-w-screen-lg mx-auto pb-4 flex justify-center">
        <img
          src="img/shopping-cart-2.jpg"
          alt="grocery cart logo"
          className="rounded-full object-scale-down h-72 w-72"
        />
      </section>
      <h1 className="text-2xl text-center text-white mb-4">Smart Shopper</h1>
      <h2 className="text-white text-center">
        The app that learns how you shop!
      </h2>
    </header>
  );
};

export default Header;
