

import { initializeApp } from 'firebase/app';

import 'firebase/auth';
import {getFirestore } from "firebase/firestore";
import Constants from 'expo-constants';

import { APIKEY, AUTHDOMAIN, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID, MEASUREMENTID} from '@env';
// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId:MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore;

export default app;
