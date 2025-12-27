import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export const createUserIfNotExists = async (user: User) => {
  console.log("🔥 createUserIfNotExists called");
  console.log("User UID:", user.uid);

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  console.log("User exists?", snap.exists());

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "user",
      createdAt: serverTimestamp(),
    });

    console.log("✅ User written to Firestore");
  }
};
