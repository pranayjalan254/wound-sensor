import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3nyxB8NCdJCJTapb4-g2M4jwjijPjRpg",
  authDomain: "wound-area.firebaseapp.com",
  projectId: "wound-area",
  storageBucket: "wound-area.appspot.com",
  messagingSenderId: "663929710777",
  appId: "1:663929710777:web:aeb288c57a6f1d6f641368",
  measurementId: "G-C468XTY5W0",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
