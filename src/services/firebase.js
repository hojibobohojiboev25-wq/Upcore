import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDT0F1EH11n8i2GZeVd-TBYL_NXFMUydi4',
  authDomain: 'upcore-59369.firebaseapp.com',
  projectId: 'upcore-59369',
  storageBucket: 'upcore-59369.firebasestorage.app',
  messagingSenderId: '472064480542',
  appId: '1:472064480542:web:9b020d72ccbda6fe4ee50f'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export default app;
