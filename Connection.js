import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// App's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAvL5L3SAtd_Q1T_pxU56GWttErgSdp9zc',
    authDomain: 'kahuoi-test.firebaseapp.com',
    databaseURL: 'https://kahuoi-test-default-rtdb.firebaseio.com',
    projectId: 'kahuoi-test',
    storageBucket: 'kahuoi-test.appspot.com',
    messagingSenderId: '79750544866',
    appId: '1:79750544866:web:136d8e868ea2c30ccdcdbb'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and connect to Firestore emulator for local testing (remove in production)
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);

// Initialize Authentication and connect to the Authentication emulator for local testing (remove in production)
const auth = getAuth();
connectAuthEmulator(auth, 'http://localhost:9099');
