import React from 'react';

function Errors({ message }) {
  return <div>{<p className="error">Error: {message}</p>}</div>;
}

export default Errors;
