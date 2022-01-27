import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function Errors({ duplicateMessage }) {
  return <div>{<p className="error">Error: {duplicateMessage}</p>}</div>;
}

export default Errors;
