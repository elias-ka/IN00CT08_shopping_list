import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

initializeApp(firebaseConfig);

const firestore = getFirestore();
const SHOPPING_LIST = "shopping_list";

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export {
  firestore,
  SHOPPING_LIST,
  converter,
  doc,
  addDoc,
  deleteDoc,
  collection,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
};
