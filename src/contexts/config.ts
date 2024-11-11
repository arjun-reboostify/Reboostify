import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    reauthenticateWithPopup,
    User,
} from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, doc, setDoc } from "firebase/firestore";

// Web Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBph54Brl4-HJTRW5S0vJlZMM-nc-nkdg",
  authDomain: "reboostify-f18db.firebaseapp.com",
  databaseURL: "https://reboostify-f18db-default-rtdb.firebaseio.com",
  projectId: "reboostify-f18db",
  storageBucket: "reboostify-f18db.appspot.com",
  messagingSenderId: "870800978453",
  appId: "1:870800978453:web:cffcfca384b9d1de3f141c",
  measurementId: "G-Z86QKJ0ND8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Authentication initilization and reference
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export const googleAuthorize = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "User"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await setDoc(doc(db, "User", user.uid), {
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                isSetup: false,
                uid: user.uid,
                color: "red",
            });
        }
    } catch (err) {
        console.error(err);
    }
};

export async function reauthWithGoogle(user: User) {
    return await reauthenticateWithPopup(user, googleProvider);
}