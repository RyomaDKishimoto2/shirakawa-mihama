// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAKhZ7jU9wyZUgB0NKbo4XNQ9pWIgPs324',
  authDomain: 'fir-next-auth-b761d.firebaseapp.com',
  projectId: 'fir-next-auth-b761d',
  storageBucket: 'fir-next-auth-b761d.appspot.com',
  messagingSenderId: '546374351096',
  appId: '1:546374351096:web:b54fe8415a8896fb4d630d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
