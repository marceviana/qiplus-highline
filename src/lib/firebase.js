import * as FirebaseModule from 'firebase';
import firebaseConfig from '../constants/firebase';

const {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket,
  messagingSenderId,
} = firebaseConfig;

let firebaseInitialized = false;

if (
  apiKey !== 'null' &&
  authDomain !== 'null' &&
  databaseURL !== 'null' &&
  storageBucket !== 'null' &&
  messagingSenderId !== 'null'
) {
  FirebaseModule.initializeApp({
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
    messagingSenderId,
  });

  firebaseInitialized = true;
}

export const FirebaseRef = firebaseInitialized ? FirebaseModule.database().ref() : null;
export const StorageRef = firebaseInitialized ? FirebaseModule.storage().ref() : null;
export const Firebase = firebaseInitialized ? FirebaseModule : null;
export const ImagesRef = firebaseInitialized ? StorageRef.child('images') : null;

export const StorageUpload = ({
  uri,
  name,
  endpoint,
  path = '/',
  storage,
  token,
}) => new Promise(async (res, rej) => {
  try {
    const body = new FormData();

    body.append(path, { uri, name });

    const upload = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data',
      }
    });

    if (!upload.ok) {
      const err = await upload.json();

      rej(new Error(err));
    }

    const metadata = await storage.ref(`${path}${name}`).getMetadata();

    res(metadata);
  } catch (err) {
    rej(err);
  }
});
