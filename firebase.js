import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDmJv9gVCkiBSXjtb86loYu3_9j_0a9t_w",
    authDomain: "ideabucket-a86af.firebaseapp.com",
    projectId: "ideabucket-a86af",
    storageBucket: "ideabucket-a86af.appspot.com",
    messagingSenderId: "601990399867",
    appId: "1:601990399867:web:395eaf365d85bee6aadfde"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }