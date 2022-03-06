import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import ListLayout from './ListLayout';
import Header from './Header';

function ListView() {
  const [items, setItems] = useState([]);
  //loading is true until list is retrieved from database, this value controls the component rendering
  const [isDataLoading, setIsDataLoading] = useState(true);

  const localToken = localStorage.getItem('list-token');
  const navigate = useNavigate();
  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    if (!localToken) {
      navigate('/');
      return;
    }

    const unsubscribe = onSnapshot(collection(db, localToken), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => {
        snapshotDocs.push({ ...doc.data(), id: doc.id, checked: false });
      });
      setItems(snapshotDocs);
      setIsDataLoading(false);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, [localToken, navigate]);

  //loading state controls page render to ensure items.length can evaluate after the items have been retrieved from firebase
  return (
    <>
      {isDataLoading && (
        <img src="img/loading.gif" alt="loading" className="m-auto" />
      )}
      {!isDataLoading && (
        <div className="m-25">
          {items.length ? (
            <>
              <ListLayout
                items={items}
                localToken={localToken}
                loading={isDataLoading}
              />
            </>
          ) : (
            <>
              <Header display={'hidden'} />
              <Welcome />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ListView;
