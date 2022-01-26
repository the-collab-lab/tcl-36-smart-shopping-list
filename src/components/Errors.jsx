import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function Errors({ error }) {
  return <div>{<p className="error">Error: {error}</p>}</div>;
}

export default Errors;
